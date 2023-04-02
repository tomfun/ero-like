export * from './data.entity';
export * from './signature.entity';
export * from './report.entity';
export * from './user.entity';

import { DataEntity } from './data.entity';
import { SignatureEntity } from './signature.entity';
import { ReportEntity } from './report.entity';
import { UserEntity } from './user.entity';

export const entities = [DataEntity, SignatureEntity, ReportEntity, UserEntity];
