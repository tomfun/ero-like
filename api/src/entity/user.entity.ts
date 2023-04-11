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
import type { SignatureEntity } from './signature.entity';

@Entity('user')
export class UserEntity extends UserEntityInner {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ApiProperty()
  // prevent circular dependency
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  @ManyToOne(() => require('./signature.entity').SignatureEntity)
  declare agreementSignature: SignatureEntity;

  @ApiProperty()
  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  @ApiProperty()
  @Column()
  declare nick: string;
}
