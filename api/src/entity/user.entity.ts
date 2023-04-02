import { UserEntity as UserEntityInner } from 'ero-like-sdk/dist/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { SignatureEntity } from './signature.entity';

@Entity('user')
export class UserEntity extends UserEntityInner {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ManyToOne(() => SignatureEntity)
  declare agreementSignature: SignatureEntity;

  @ManyToOne(() => SignatureEntity)
  declare firstUpdateSignature: SignatureEntity;

  @ManyToOne(() => SignatureEntity)
  declare lastUpdateSignature: SignatureEntity;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  @Column()
  declare nick: string;
}
