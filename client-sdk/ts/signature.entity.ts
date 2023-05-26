import { BlockEntity } from './block.entity';
import { DataEntity } from './data.entity';
import { PublicKeyEntity } from './public-key.entity';
import { UserEntity } from './user.entity';

export class SignatureEntity {
  id: string;

  data: DataEntity | null;

  block: BlockEntity | null;

  signedPublicKey: PublicKeyEntity | null;

  user: UserEntity | null;

  publicKey: PublicKeyEntity | null;

  createdAt: Date;

  updatedAt: Date;

  signedAt: Date;

  hash: string[];

  usedKeyFingerprint: string | ArrayBuffer;

  signature: string | ArrayBuffer;
}
