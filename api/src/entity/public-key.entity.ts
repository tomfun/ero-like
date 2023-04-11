import { ApiProperty } from '@nestjs/swagger';
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

@Entity('publicKey')
export class PublicKeyEntity extends PublicKeyEntityInner {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  declare id: string;

  @ApiProperty()
  @ManyToOne(() => BlockEntity)
  declare block: BlockEntity;

  @CreateDateColumn()
  @ApiProperty()
  declare createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  declare updatedAt: Date;

  @Column()
  @ApiProperty()
  declare invalidAt: Date;

  @ApiProperty()
  @Column()
  declare type: string;

  @Column({ type: 'bytea' })
  declare primaryKeyFingerprint: string | ArrayBuffer;

  @Column({ type: 'bytea' })
  declare publicKeyFingerprint: string | ArrayBuffer;

  get publicKeyFingerprintString() {
    return typeof this.publicKeyFingerprint === 'string'
      ? this.publicKeyFingerprint
      : this.publicKeyFingerprint.toString();
  }

  @Column({ type: 'bytea' })
  declare publicKey: string;
}
