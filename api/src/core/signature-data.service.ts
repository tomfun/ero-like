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
import {
  GpgService,
  InvalidDataError,
  NoPublicKeyVerifyError,
} from './gpg.service';
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
    const { signatureData } = data;

    let publicKeyBlock = new BlockEntity();
    publicKeyBlock.createdAt = now;
    publicKeyBlock.type = BlockType.PUBLIC;
    publicKeyBlock.blockArmored = importAndVerifyPayload.publicKeyArmored;
    publicKeyBlock = await this.findOrDefaultBlock(publicKeyBlock);

    const publicKeys = [] as Array<PublicKeyEntity>;
    for (const keyData of data.publicKeys) {
      let publicKey = new PublicKeyEntity();
      publicKey.primaryKeyFingerprint = signatureData.primaryKeyFingerprint;
      publicKey.publicKeyFingerprint = keyData.publicKeyFingerprint;
      publicKey.type = keyData.type;
      publicKey.keygrip = keyData.grp;
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
        publicKey.invalidAt = keyData.expires;
      }
      publicKey.block = publicKeyBlock;
      publicKeys.push(publicKey);
    }

    let agreement = new DataEntity();
    agreement.createdAt = now;
    agreement.type = 'text';
    agreement.mime = 'text/plain';
    agreement.clearSignDataPart = signatureData.clearSignDataPart;
    agreement.sha256 = await this.calculateSha256(agreement.clearSignDataPart);

    agreement = await this.findOrDefaultData(agreement);

    let agreementSignatureBlock = new BlockEntity();
    agreementSignatureBlock.createdAt = now;
    agreementSignatureBlock.type = BlockType.SIGNATURE;
    agreementSignatureBlock.blockArmored = signatureData.clearSignSignaturePart;
    agreementSignatureBlock = await this.findOrDefaultBlock(
      agreementSignatureBlock,
    );

    let agreementSignature = new SignatureEntity();
    agreementSignature.createdAt = now;
    agreementSignature.data = agreement;
    agreementSignature.hash = signatureData.hash;
    agreementSignature.signature = data.signature;
    agreementSignature.packet = await this.gpgService.armor(
      signatureData.clearSignSignaturePart,
    );
    agreementSignature.primaryKeyFingerprint =
      signatureData.primaryKeyFingerprint;
    agreementSignature.signedAt = signatureData.signatureDate;
    agreementSignature.usedKeyFingerprint = signatureData.usedKeyFingerprint;
    agreementSignature = await this.findOrDefaultSignature(agreementSignature);
    agreementSignature.publicKey = publicKeys.find(
      (pk) =>
        pk.publicKeyFingerprintString === signatureData.usedKeyFingerprint,
    );
    if (!agreementSignature.block) {
      agreementSignature.block = agreementSignatureBlock;
    }
    if (!agreementSignature.publicKey) {
      throw new Error(
        'Cannot be ok registration agreement without known agreementSignature.publicKey',
      );
    }

    return {
      publicKeyBlock,
      publicKeys,
      agreementSignatureBlock,
      agreementSignature,
      verifyData: data,
    };
  }

  async createEntity(data: { clearSignArmored: string; type: string }) {
    const now = new Date();
    let verifyData: UnwrapPromise<
      ReturnType<typeof GpgService.prototype.verify>
    >;
    let publicKey: PublicKeyEntity = null;
    try {
      verifyData = await this.gpgService.verify(data);
    } catch (e) {
      if (!(e instanceof NoPublicKeyVerifyError)) {
        throw e;
      }
      const publicKeys = await this.publicKeyRepo.find({
        where: {
          publicKeyFingerprint: e.keyFingerprint,
        },
        relations: {
          user: true,
          block: true,
        },
      });
      for (const key of publicKeys) {
        await this.gpgService.loadKey({
          publicKeyArmored: key.block.blockArmored,
        });
        try {
          verifyData = await this.gpgService.verify(data);
        } catch (e) {
          if (!(e instanceof NoPublicKeyVerifyError)) {
            throw e;
          }
        }
        if (verifyData) {
          publicKey = key;
          break;
        }
      }
      if (!verifyData) {
        throw new InvalidDataError(
          'verification failed: used unregistered key',
        );
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

    let signatureBlock = new BlockEntity();
    signatureBlock.createdAt = now;
    signatureBlock.type = BlockType.SIGNATURE;
    signatureBlock.blockArmored = verifyData.clearSignSignaturePart;
    signatureBlock = await this.findOrDefaultBlock(signatureBlock);

    let packet: Buffer;
    // eslint-disable-next-line prefer-const
    [packet, dataEntity] = await Promise.all([
      this.gpgService.armor(verifyData.clearSignSignaturePart),
      this.findOrDefaultData(dataEntity),
    ]);

    let signature = new SignatureEntity();
    signature.createdAt = now;
    signature.data = dataEntity;
    signature.hash = verifyData.hash;
    signature.signature = verifyData.signature;
    signature.packet = packet;
    signature.primaryKeyFingerprint = verifyData.primaryKeyFingerprint;
    signature.signedAt = verifyData.signatureDate;
    signature.usedKeyFingerprint = verifyData.usedKeyFingerprint;
    signature = await this.findOrDefaultSignature(signature);
    signature.block = signatureBlock;
    signature.publicKey =
      publicKey ||
      (await this.publicKeyRepo.findOne({
        where: {
          primaryKeyFingerprint: verifyData.primaryKeyFingerprint,
          publicKeyFingerprint: verifyData.usedKeyFingerprint,
        },
        relations: {
          user: true,
        },
      }));
    signature.user = signature.publicKey.user;

    return {
      signature,
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
        'usedKeyFingerprint',
      ]),
    );
    if (s) {
      s.data = signature.data;
      return s;
    }
    return signature;
  }
}
