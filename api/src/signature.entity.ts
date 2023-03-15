import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { DataEntity } from './data.entity';

@Entity('signature')
export class SignatureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DataEntity)
  data: DataEntity;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  signedAt: Date;

  @Column({ type: 'simple-array' })
  hash: string[];

  @Column({ type: 'bytea' })
  primaryKeyFingerprint: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  subkeyFingerprint: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  signature: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  packet: string | ArrayBuffer;
}
