import { ApiProperty } from '@nestjs/swagger';
import { SignatureEntity as SignatureEntityInner } from 'ero-like-sdk/dist/signature.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { BlockEntity } from './block.entity';
import { DataEntity } from './data.entity';
import { PublicKeyEntity } from './public-key.entity';
import { UserEntity } from './user.entity';

@Entity('signature')
export class SignatureEntity extends SignatureEntityInner {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ApiProperty()
  @ManyToOne(() => BlockEntity)
  declare block: BlockEntity;

  @ManyToOne(() => DataEntity)
  declare data: DataEntity;

  @ManyToOne(() => UserEntity)
  declare user: UserEntity;

  @ManyToOne(() => PublicKeyEntity)
  declare signedPublicKey: PublicKeyEntity;

  @ManyToOne(() => PublicKeyEntity)
  declare publicKey: PublicKeyEntity;

  @CreateDateColumn()
  declare createdAt: Date;

  @Column({ type: 'timestamp' })
  declare signedAt: Date;

  @Column({ type: 'simple-array' })
  declare hash: string[];

  @Column({ type: 'bytea' })
  declare primaryKeyFingerprint: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare usedKeyFingerprint: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare signature: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare packet: string | ArrayBuffer;
}
