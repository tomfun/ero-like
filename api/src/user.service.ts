import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { createHash } from 'crypto';
import { pick } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DataEntity } from './data.entity';
import { GpgService, ImportAndVerifyPayload } from './gpg.service';
import { SignatureEntity } from './signature.entity';
import { UserEntity } from './user.entity';

export {
  ReportForList,
  ReportBodyPayload,
  ReportEntity,
} from './report.entity';

export class NotAcceptAgreementError extends Error {}
export class UserCreateError extends Error {}

@Injectable()
export class UserService {
  @InjectDataSource()
  private dataSource: DataSource;

  @InjectRepository(UserEntity)
  private userRepo: Repository<UserEntity>;

  @InjectRepository(DataEntity)
  private dataRepo: Repository<DataEntity>;

  @Inject()
  private gpgService: GpgService;

  async createUserDryRun(importAndVerifyPayload: ImportAndVerifyPayload) {
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
    const regexHeader =
      /-----BEGIN PGP SIGNED MESSAGE-----\n(Hash: ((\w+,?)*)\n)?\n/m;
    const indexOfSignature = importAndVerifyPayload.clearSignArmored.indexOf(
      '\n-----BEGIN PGP SIGNATURE-----',
    );
    agreement.clearSignDataPart = importAndVerifyPayload.clearSignArmored
      .slice(0, indexOfSignature)
      .replace(regexHeader, '');
    if (
      !agreement.clearSignDataPart.match(
        /^I read and agree with all terms of use of ero-like and confirm my registration on ero-like$/,
      )
    ) {
      throw new NotAcceptAgreementError("Text doesn't match");
    }
    agreement.sha256 = await this.calculateSha256(agreement.clearSignDataPart);

    [publicKey, agreement] = await Promise.all([
      this.findOrDefaultData(publicKey),
      this.findOrDefaultData(agreement),
    ]);

    const publicKeySign = new SignatureEntity();
    publicKeySign.createdAt = now;
    publicKeySign.data = publicKey;
    publicKeySign.hash = [];
    publicKeySign.signature = ''; // :(
    publicKeySign.primaryKeyFingerprint = data.mainKey;
    publicKeySign.signedAt = data.signatureDate;
    publicKeySign.subkeyFingerprint = data.usedKeyFingerprint;

    let u: UserEntity;
    if (publicKeySign.data.id) {
      u = await this.userRepo.findOne({
        where: {
          firstUpdateSignature: {
            data: publicKey,
            primaryKeyFingerprint: publicKeySign.primaryKeyFingerprint,
            signature: '',
          },
        },
        relations: { firstUpdateSignature: true },
      });
      if (u) {
        u.firstUpdateSignature.data = publicKey;
        u.lastUpdateSignature = u.firstUpdateSignature;
      } else {
        u = await this.userRepo.findOne({
          where: {
            firstUpdateSignature: {
              primaryKeyFingerprint: publicKeySign.primaryKeyFingerprint,
              signature: '',
            },
          },
          relations: { firstUpdateSignature: true },
        });
        if (u) {
          throw new UserCreateError(
            'User is already created with different public key',
          );
        }
      }
    }
    if (!u) {
      u = new UserEntity();
      u.createdAt = now;
      u.firstUpdateSignature = u.lastUpdateSignature = publicKeySign;
    }
    const agreementSign = new SignatureEntity();
    agreementSign.createdAt = now;
    agreementSign.data = agreement;
    const hashMatch =
      importAndVerifyPayload.clearSignArmored.match(regexHeader);
    agreementSign.hash =
      hashMatch && hashMatch[2] ? hashMatch[2].split(',') : ['MD5'];
    agreementSign.signature = data.signature;
    agreementSign.primaryKeyFingerprint = data.mainKey;
    agreementSign.signedAt = data.signatureDate;
    agreementSign.subkeyFingerprint = data.usedKeyFingerprint;

    u.nick = data.importedKeyUser.replace(/<.+@.+>/, '').trim();
    u.agreementSignature = agreementSign;

    return {
      user: u,
      verifyData: data,
    };
  }

  async createUser(
    importAndVerifyPayload: ImportAndVerifyPayload,
  ): Promise<UserEntity> {
    const { user } = await this.createUserDryRun(importAndVerifyPayload);
    await this.dataSource.manager.save([
      user.firstUpdateSignature.data,
      user.agreementSignature.data,
    ]);
    return this.dataSource.transaction<UserEntity>(async (m) => {
      const signatures = await m.save([
        user.firstUpdateSignature,
        user.agreementSignature,
      ]);
      user.firstUpdateSignature = signatures[0];
      user.agreementSignature = signatures[1];

      console.log(user);

      return m.save(user);
    });
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
}
