import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ImportAndVerifyPayload } from './verify.payload';
import { SignatureDataService } from './signature-data.service';
import { PublicKeyEntity, SignatureEntity, UserEntity } from '../entity';

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
    const { agreementSignature, verifyData, publicKeys } =
      await this.signService.userRegistration(importAndVerifyPayload);

    if (
      !agreementSignature.data.clearSignDataPart.match(
        /^I read and agree with all terms of use of ero-like and confirm my registration on ero-like$/,
      )
    ) {
      throw new NotAcceptAgreementError("Signed agreement text doesn't match");
    }
    const publicKeyIds = publicKeys.map((p) => p.id).filter((id) => id);
    const publicKeyUsers = publicKeyIds.length
      ? await this.dataSource.manager
          .createQueryBuilder(UserEntity, 'u')
          .innerJoin(
            PublicKeyEntity,
            'pukey',
            'u.id = pukey."userId" AND pukey.id in (:...ids)',
            {
              ids: publicKeyIds,
            },
          )
          .take(2)
          .getMany()
      : [];
    if (publicKeyUsers.length > 1) {
      throw new UserCreateError('There are many users with such public key');
    }
    const signatureCreatedUser =
      agreementSignature.id &&
      (await this.dataSource.manager
        .createQueryBuilder(UserEntity, 'u')
        .innerJoin(SignatureEntity, 's', 'u.id = s."userId" AND s.id = :id', {
          id: agreementSignature.id,
        })
        .getOne());
    if (
      signatureCreatedUser &&
      publicKeyUsers.length > 0 &&
      signatureCreatedUser.id !== publicKeyUsers[0].id
    ) {
      throw new Error(
        'There are signature with user not included in public key',
      );
    }
    let u: UserEntity;
    if (signatureCreatedUser) {
      u = signatureCreatedUser;
    } else {
      u = new UserEntity();
      u.createdAt = agreementSignature.createdAt;
    }

    u.nick = verifyData.importedKeyUser.replace(/<.+@.+>/, '').trim();
    u.agreementSignature = agreementSignature;

    return {
      user: u,
      publicKeys,
      verifyData,
    };
  }

  async createUser(
    importAndVerifyPayload: ImportAndVerifyPayload,
  ): Promise<UserEntity> {
    const { user, publicKeys } = await this.createUserDryRun(
      importAndVerifyPayload,
    );
    await this.dataSource.manager.save(user.agreementSignature.data);
    return this.dataSource.transaction<UserEntity>(async (m) => {
      await m.save(Array.from(new Set(publicKeys.map((p) => p.block))));
      await m.save(publicKeys);
      await m.save(user.agreementSignature.block);
      user.agreementSignature = await m.save(user.agreementSignature);
      await m.save(user);
      const userUpdateEntities = [user.agreementSignature, ...publicKeys];
      userUpdateEntities.forEach((e) => (e.user = user));
      await m.save(userUpdateEntities);
      return user;
    });
  }
}
