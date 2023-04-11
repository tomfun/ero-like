import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { createHash } from 'crypto';
import { pick } from 'lodash';
import { DataSource, Repository } from 'typeorm';
import {
  BlockEntity,
  BlockType,
  DataEntity,
  PublicKeyEntity,
  SignatureEntity,
} from '../entity';
import { GpgService, NoPublicKeyVerifyError } from './gpg.service';
import { ImportAndVerifyPayload } from './verify.payload';

type UnwrapPromise<T> = T extends Promise<infer R> ? R : never;

@Injectable()
export class SignatureDataService {
  @InjectDataSource()
  private dataSource: DataSource;

  @InjectRepository(BlockEntity)
  private blockRepo: Repository<BlockEntity>;

  @InjectRepository(DataEntity)
  private dataRepo: Repository<DataEntity>;

  @InjectRepository(PublicKeyEntity)
  private publicKeyRepo: Repository<PublicKeyEntity>;

  @InjectRepository(SignatureEntity)
  private signRepo: Repository<SignatureEntity>;

  @Inject()
  private gpgService: GpgService;

  async userRegistration(importAndVerifyPayload: ImportAndVerifyPayload) {
    const now = new Date();
    const data = await this.gpgService.temporaryImportAndVerify(
      importAndVerifyPayload,
    );

    let publicKeyBlock = new BlockEntity();
    publicKeyBlock.createdAt = now;
    publicKeyBlock.type = BlockType.PUBLIC;
    publicKeyBlock.blockArmored = importAndVerifyPayload.publicKeyArmored;
    publicKeyBlock = await this.findOrDefaultBlock(publicKeyBlock);

    const publicKeys = [];
    for (const keyData of data.publicKeys) {
      let publicKey = new PublicKeyEntity();
      publicKey.publicKeyFingerprint = keyData.publicKeyFingerprint;
      publicKey.type = keyData.type;
      publicKey.publicKey = keyData.pkey.join('');
      publicKey = await this.findOrDefaultPublicKey(publicKey);
      if (publicKey.id) {
        if (keyData.expires && keyData.expires > now) {
          publicKey.invalidAt = keyData.expires;
        } else if (!keyData.expires && publicKey.invalidAt > now) {
          publicKey.invalidAt = null;
        } else if (keyData.expires && keyData.expires < now) {
          if (publicKey.invalidAt) {
            publicKey.invalidAt =
              publicKey.invalidAt < now ? publicKey.invalidAt : now;
          } else {
            publicKey.invalidAt = now;
          }
        }
      } else {
        publicKey.createdAt = keyData.created;
        publicKey.block = publicKeyBlock;
        publicKey.invalidAt = keyData.expires;
      }
    }

    let agreement = new DataEntity();
    agreement.createdAt = now;
    agreement.type = 'text';
    agreement.mime = 'text/plain';
    agreement.clearSignDataPart = data.signatureData.clearSignDataPart;
    agreement.sha256 = await this.calculateSha256(agreement.clearSignDataPart);

    [publicKey, agreement] = await Promise.all([
      this.findOrDefaultData(publicKey),
      this.findOrDefaultData(agreement),
    ]);

    const publicKeySignature = new SignatureEntity();
    publicKeySignature.createdAt = now;
    publicKeySignature.data = publicKey;
    publicKeySignature.hash = [];
    publicKeySignature.signature = ''; // :(
    publicKeySignature.packet = ''; // 1 signature must have only 1 sign  :(
    publicKeySignature.primaryKeyFingerprint = data.mainKey;
    publicKeySignature.signedAt = data.signatureDate;
    publicKeySignature.subkeyFingerprint = data.usedKeyFingerprint;

    const agreementSignature = new SignatureEntity();
    agreementSignature.createdAt = now;
    agreementSignature.data = agreement;
    agreementSignature.hash = data.hash;
    agreementSignature.signature = data.signature;
    agreementSignature.packet = await this.gpgService.armor(
      data.clearSignSignaturePart,
    );
    agreementSignature.primaryKeyFingerprint = data.mainKey;
    agreementSignature.signedAt = data.signatureDate;
    agreementSignature.subkeyFingerprint = data.usedKeyFingerprint;

    return {
      publicKey,
      agreementSignature,
      verifyData: data,
    };
  }

  async createEntity(data: { clearSignArmored: string; type: string }) {
    const now = new Date();
    let verifyData: UnwrapPromise<
      ReturnType<typeof GpgService.prototype.verify>
    >;
    let notFoundError;
    try {
      verifyData = await this.gpgService.verify(data);
    } catch (e) {
      if (!(e instanceof NoPublicKeyVerifyError)) {
        throw e;
      }
      notFoundError = e;
      // todo: use another repo
      const publicKeysSignatures = await this.signRepo.find({
        where: {
          signature: '',
          packet: '',
          subkeyFingerprint: e.keyFingerprint,
        },
        relations: {
          data: true,
        },
      });
      const dataObj = publicKeysSignatures.reduce((acc, s) => {
        if (!(s.data.id in acc)) {
          acc[s.data.id] = s.data;
        }
        return acc;
      }, {} as Record<string, DataEntity>);
      for (const id in dataObj) {
        await this.gpgService.loadKey({
          publicKeyArmored: dataObj[id].clearSignDataPart,
        });
        try {
          verifyData = await this.gpgService.verify(data);
        } catch (e) {
          if (!(e instanceof NoPublicKeyVerifyError)) {
            throw e;
          }
        }
        if (verifyData) {
          break;
        }
      }
      if (!verifyData) {
        throw notFoundError;
      }
    }

    let dataEntity = new DataEntity();
    dataEntity.createdAt = now;
    dataEntity.type = data.type;
    dataEntity.mime = 'application/json';
    dataEntity.clearSignDataPart = verifyData.clearSignDataPart;
    dataEntity.sha256 = await this.calculateSha256(
      dataEntity.clearSignDataPart,
    );

    let packet: Buffer;
    // eslint-disable-next-line prefer-const
    [packet, dataEntity] = await Promise.all([
      this.gpgService.armor(verifyData.clearSignSignaturePart),
      this.findOrDefaultData(dataEntity),
    ]);

    const signature = new SignatureEntity();
    signature.createdAt = now;
    signature.data = dataEntity;
    signature.hash = verifyData.hash;
    signature.signature = verifyData.signature;
    signature.packet = packet;
    signature.primaryKeyFingerprint = verifyData.primaryKeyFingerprint;
    signature.signedAt = verifyData.signatureDate;
    signature.subkeyFingerprint = verifyData.usedKeyFingerprint;

    return {
      signature: await this.findOrDefaultSignature(signature),
      verifyData,
    };
  }

  private async calculateSha256(str: string) {
    const hash = createHash('sha256');
    hash.update(str, 'utf8');
    return hash.digest('hex');
  }

  private async findOrDefaultBlock(block: BlockEntity) {
    const b = await this.blockRepo.findOneBy(
      pick(block, ['blockArmored', 'type']),
    );
    return b || block;
  }

  private async findOrDefaultData(data: DataEntity) {
    const d = await this.dataRepo.findOneBy(
      pick(data, ['clearSignDataPart', 'type', 'sha256']),
    );
    return d || data;
  }

  private async findOrDefaultPublicKey(key: PublicKeyEntity) {
    const p = await this.publicKeyRepo.findOneBy(
      pick(key, ['publicKeyFingerprint', 'publicKey', 'type']),
    );
    return p || key;
  }

  private async findOrDefaultSignature(signature: SignatureEntity) {
    const s = await this.signRepo.findOneBy(
      pick(signature, [
        'data.id', // important
        // 'hash', // orm bug
        'signature',
        'packet', // important
        'primaryKeyFingerprint',
        'signedAt',
        'subkeyFingerprint',
      ]),
    );
    if (s) {
      s.data = signature.data;
      return s;
    }
    return signature;
  }
}
