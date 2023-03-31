import { SignatureEntity } from './signature.entity';

export class UserEntity {
  id: string;

  agreementSignature: SignatureEntity;

  firstUpdateSignature: SignatureEntity;

  lastUpdateSignature: SignatureEntity;

  createdAt: Date;

  updatedAt: Date;

  nick: string;
}
