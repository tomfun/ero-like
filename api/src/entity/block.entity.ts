import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BlockEntity as BlockEntityInner } from 'ero-like-sdk/dist/block.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum BlockType {
  NEW = 'new',
  // 'PGP SIGNED MESSAGE',
  SIGNATURE = 'PGP SIGNATURE',
  MESSAGE = 'PGP MESSAGE',
  PUBLIC = 'PGP PUBLIC KEY BLOCK',
  PRIVATE = 'PGP PRIVATE KEY BLOCK',
}

@Entity('block')
export class BlockEntity extends BlockEntityInner {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ApiProperty()
  @Expose()
  @CreateDateColumn()
  declare createdAt: Date;

  @ApiProperty()
  @Expose()
  @Column({
    type: 'enum',
    enum: BlockType,
  })
  declare type: BlockType;

  @ApiProperty()
  @Expose()
  @Column({ type: 'text' })
  declare blockArmored: string;
}
