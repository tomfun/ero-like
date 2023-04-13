import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PublicKeyEntity as PublicKeyEntityInner } from 'ero-like-sdk/dist/public-key.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { BlockEntity } from './block.entity';
import { UserEntity } from './user.entity';

@Entity('publicKey')
export class PublicKeyEntity extends PublicKeyEntityInner {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ApiProperty()
  @Expose({ groups: ['entity', 'user'] })
  @ManyToOne(() => BlockEntity)
  declare block: BlockEntity;

  @ApiProperty()
  @Expose({ groups: ['entity'] })
  @ManyToOne(() => UserEntity)
  declare user: UserEntity;

  @ApiProperty()
  @Expose()
  @CreateDateColumn()
  declare createdAt: Date;

  @ApiProperty()
  @Expose()
  @UpdateDateColumn()
  declare updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Column()
  declare invalidAt: Date;

  @Column()
  declare type: string;

  @Column({ type: 'bytea' })
  declare primaryKeyFingerprint: string | ArrayBuffer;

  @ApiProperty({ name: 'primaryKeyFingerprint' })
  @Expose({ name: 'primaryKeyFingerprint' })
  get primaryKeyFingerprintString() {
    return typeof this.primaryKeyFingerprint === 'string'
      ? this.primaryKeyFingerprint
      : this.primaryKeyFingerprint.toString();
  }

  @Column({ type: 'bytea' })
  declare publicKeyFingerprint: string | ArrayBuffer;

  @ApiProperty({ name: 'publicKeyFingerprint' })
  @Expose({ name: 'publicKeyFingerprint' })
  get publicKeyFingerprintString() {
    return typeof this.publicKeyFingerprint === 'string'
      ? this.publicKeyFingerprint
      : this.publicKeyFingerprint.toString();
  }

  @Column({ type: 'bytea' })
  declare publicKey: string;
}
