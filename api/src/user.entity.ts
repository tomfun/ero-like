import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne
} from 'typeorm';
import { DataEntity } from './data.entity';
import { SignatureEntity } from './signature.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SignatureEntity)
  agreementSignature: SignatureEntity;

  @ManyToOne(() => SignatureEntity)
  firstUpdateSignature: SignatureEntity;

  @ManyToOne(() => SignatureEntity)
  lastUpdateSignature: SignatureEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  nick: string;
}
