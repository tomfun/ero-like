export * from './block.entity';
export * from './data.entity';
export * from './public-key.entity';
export * from './signature.entity';
export * from './report.entity';
export * from './user.entity';

import { BlockEntity } from './block.entity';
import { DataEntity } from './data.entity';
import { PublicKeyEntity } from './public-key.entity';
import { SignatureEntity } from './signature.entity';
import { ReportEntity } from './report.entity';
import { UserEntity } from './user.entity';

export const entities = [
  BlockEntity,
  DataEntity,
  PublicKeyEntity,
  SignatureEntity,
  ReportEntity,
  UserEntity,
];
