import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { createHash } from 'crypto';
import { pick } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DataEntity, SignatureEntity } from '../entity';
import { GpgService, NoPublicKeyVerifyError } from './gpg.service';
import { ImportAndVerifyPayload } from './verify.payload';

type UnwrapPromise<T> = T extends Promise<infer R> ? R : never;

@Injectable()
export class SignatureDataService {
  @InjectDataSource()
  private dataSource: DataSource;

  @InjectRepository(DataEntity)
  private dataRepo: Repository<DataEntity>;

  @InjectRepository(SignatureEntity)
  private signRepo: Repository<SignatureEntity>;

  @Inject()
  private gpgService: GpgService;

  async userRegistration(importAndVerifyPayload: ImportAndVerifyPayload) {
    const now = new Date();
    const data = await this.gpgService.temporaryImportAndVerify(
      importAndVerifyPayload,
    );

    let publicKey = new DataEntity();
    publicKey.createdAt = now;
    publicKey.type = 'text/gpg/public-key';
    publicKey.mime = 'text/plain';
    publicKey.clearSignDataPart = importAndVerifyPayload.publicKeyArmored;
    publicKey.sha256 = await this.calculateSha256(publicKey.clearSignDataPart);

    let agreement = new DataEntity();
    agreement.createdAt = now;
    agreement.type = 'text';
    agreement.mime = 'text/plain';
    agreement.clearSignDataPart = data.clearSignDataPart;
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
      publicKeySignature,
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
    signature.primaryKeyFingerprint = verifyData.mainKey;
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

  private async findOrDefaultData(data: DataEntity) {
    const d = await this.dataRepo.findOneBy(
      pick(data, ['clearSignDataPart', 'type', 'sha256']),
    );
    return d || data;
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
