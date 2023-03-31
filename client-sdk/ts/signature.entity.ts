import { DataEntity } from './data.entity';

export class SignatureEntity {
  id: string;

  data: DataEntity;

  createdAt: Date;

  signedAt: Date;

  hash: string[];

  primaryKeyFingerprint: string | ArrayBuffer;

  subkeyFingerprint: string | ArrayBuffer;

  signature: string | ArrayBuffer;

  packet: string | ArrayBuffer;
}
