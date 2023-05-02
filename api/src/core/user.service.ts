import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ImportAndVerifyPayload } from './verify.payload';
import { SignatureDataService } from './signature-data.service';
import { SignatureEntity, UserEntity } from '../entity';

export class NotAcceptAgreementError extends Error {}
export class UserCreateError extends Error {}
export class UserNotFoundError extends Error {}

@Injectable()
export class UserService {
  @InjectDataSource()
  private dataSource: DataSource;

  @InjectRepository(UserEntity)
  private userRepo: Repository<UserEntity>;

  @Inject()
  private signService: SignatureDataService;

  async createUserDryRun(importAndVerifyPayload: ImportAndVerifyPayload) {
    const { agreementSignature, publicKeySignature, verifyData } =
      await this.signService.userRegistration(importAndVerifyPayload);

    if (
      !agreementSignature.data.clearSignDataPart.match(
        /^I read and agree with all terms of use of ero-like and confirm my registration on ero-like$/,
      )
    ) {
      throw new NotAcceptAgreementError("Text doesn't match");
    }

    let u: UserEntity;
    if (publicKeySignature.data.id) {
      u = await this.userRepo.findOne({
        where: {
          firstUpdateSignature: {
            data: publicKeySignature.data,
            primaryKeyFingerprint: publicKeySignature.primaryKeyFingerprint,
            signature: publicKeySignature.signature,
          },
        },
        relations: { firstUpdateSignature: true },
      });
      if (u) {
        u.lastUpdateSignature = u.firstUpdateSignature;
        // not real change. data is undefined but the same
        u.lastUpdateSignature.data = publicKeySignature.data;
      } else {
        u = await this.userRepo.findOne({
          where: {
            firstUpdateSignature: {
              primaryKeyFingerprint: publicKeySignature.primaryKeyFingerprint,
              signature: publicKeySignature.signature,
            },
          },
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
      u.createdAt = agreementSignature.createdAt;
      u.firstUpdateSignature = u.lastUpdateSignature = publicKeySignature;
    }

    u.nick = verifyData.importedKeyUser.replace(/<.+@.+>/, '').trim();
    u.agreementSignature = agreementSignature;

    return {
      user: u,
      verifyData,
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
      return m.save(user);
    });
  }

  async fidUser(signature: SignatureEntity): Promise<UserEntity> {
    let users = await this.userRepo.findBy({
      lastUpdateSignature: {
        primaryKeyFingerprint: signature.primaryKeyFingerprint,
        subkeyFingerprint: signature.subkeyFingerprint,
        signature: '',
      },
    });
    if (users.length === 1) {
      return users[0];
    }
    if (users.length > 1) {
      throw new Error('Not implemented search by fingerprint collision (o!)');
    }
    users = await this.userRepo.findBy({
      lastUpdateSignature: {
        primaryKeyFingerprint: signature.primaryKeyFingerprint,
        signature: '',
      },
    });
    if (users.length === 1) {
      return users[0];
    }
    if (users.length > 1) {
      throw new Error('Not implemented search by fingerprint collision');
    }
    // todo: collision
    throw new UserNotFoundError('User not found');
  }
}
