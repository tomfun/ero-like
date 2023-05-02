import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ApiProperty()
  @ManyToOne(() => SignatureEntity)
  declare agreementSignature: SignatureEntity;

  @ManyToOne(() => SignatureEntity)
  declare firstUpdateSignature: SignatureEntity;

  @ManyToOne(() => SignatureEntity)
  declare lastUpdateSignature: SignatureEntity;

  @ApiProperty()
  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  @ApiProperty()
  @Column()
  declare nick: string;
}
