import { BlockEntity } from './block.entity';
import { UserEntity } from './user.entity';

export class PublicKeyEntity {
  id: string;

  block: BlockEntity;

  user: UserEntity | null;

  createdAt: Date;

  updatedAt: Date;

  invalidAt: Date | null;

  type: string;

  primaryKeyFingerprint: string | ArrayBuffer;

  keygrip: string | ArrayBuffer;

  publicKeyFingerprint: string | ArrayBuffer;

  publicKey: string | ArrayBuffer;
}
