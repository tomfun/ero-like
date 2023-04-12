import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SignatureEntity as SignatureEntityInner } from 'ero-like-sdk/dist/signature.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TransformBufferToString } from '../helper';
import { BlockEntity } from './block.entity';
import { DataEntity } from './data.entity';
import { PublicKeyEntity } from './public-key.entity';
import { UserEntity } from './user.entity';

@Entity('signature')
export class SignatureEntity extends SignatureEntityInner {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ApiProperty()
  @Expose({ groups: ['entity', 'user'] })
  @ManyToOne(() => BlockEntity)
  declare block: BlockEntity;

  @ApiProperty()
  @Expose({ groups: ['entity', 'user'] })
  @ManyToOne(() => DataEntity)
  declare data: DataEntity;

  @ApiProperty()
  @Expose({ groups: ['entity'] })
  @ManyToOne(() => UserEntity)
  declare user: UserEntity;

  @ManyToOne(() => PublicKeyEntity)
  declare signedPublicKey: PublicKeyEntity;

  @ApiProperty()
  @Expose({ groups: ['entity', 'user'] })
  @ManyToOne(() => PublicKeyEntity)
  declare publicKey: PublicKeyEntity;

  @CreateDateColumn()
  declare createdAt: Date;

  @ApiProperty()
  @Expose()
  @Column({ type: 'timestamp' })
  declare signedAt: Date;

  @ApiProperty()
  @Expose()
  @Column({ type: 'simple-array' })
  declare hash: string[];

  @ApiProperty()
  @Expose()
  @TransformBufferToString
  @Column({ type: 'bytea' })
  declare primaryKeyFingerprint: string | ArrayBuffer;

  @ApiProperty()
  @Expose()
  @TransformBufferToString
  @Column({ type: 'bytea' })
  declare usedKeyFingerprint: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare signature: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare packet: string | ArrayBuffer;
}
