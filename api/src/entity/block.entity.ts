import { ApiProperty } from '@nestjs/swagger';
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
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  declare id: string;

  @CreateDateColumn()
  @ApiProperty()
  declare createdAt: Date;

  @Column({
    type: 'enum',
    enum: BlockType,
  })
  declare type: BlockType;

  @ApiProperty()
  @Column({ type: 'text' })
  declare blockArmored: string;
}
