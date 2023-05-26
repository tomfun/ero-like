import { SignatureEntity } from './signature.entity';

export class UserEntity {
  id: string;

  agreementSignature: SignatureEntity;

  createdAt: Date;

  updatedAt: Date;

  nick: string;
}
