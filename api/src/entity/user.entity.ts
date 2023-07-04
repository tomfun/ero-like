import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { UserEntity as UserEntityInner } from 'ero-like-sdk/dist/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import type { SignatureEntity } from './signature.entity'

@Entity('user')
export class UserEntity extends UserEntityInner {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  declare id: string

  @ApiProperty()
  @Expose({ groups: ['user'] })
  // prevent circular dependency
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  @OneToOne(() => require('./signature.entity').SignatureEntity)
  @JoinColumn()
  declare agreementSignature: SignatureEntity

  @ApiProperty()
  @Expose({ groups: ['user'] })
  @CreateDateColumn()
  declare createdAt: Date

  @Expose({ groups: ['user'] })
  @UpdateDateColumn()
  declare updatedAt: Date

  @ApiProperty()
  @Expose()
  @Column()
  declare nick: string
}
