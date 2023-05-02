import { SignatureEntity as SignatureEntityInner } from 'ero-like-sdk/dist/signature.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { DataEntity } from './data.entity';

@Entity('signature')
export class SignatureEntity extends SignatureEntityInner {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ManyToOne(() => DataEntity)
  declare data: DataEntity;

  @CreateDateColumn()
  declare createdAt: Date;

  @Column({ type: 'timestamp' })
  declare signedAt: Date;

  @Column({ type: 'simple-array' })
  declare hash: string[];

  @Column({ type: 'bytea' })
  declare primaryKeyFingerprint: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare subkeyFingerprint: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare signature: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare packet: string | ArrayBuffer;
}
