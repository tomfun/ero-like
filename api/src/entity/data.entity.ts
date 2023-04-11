import { ApiProperty } from '@nestjs/swagger';
import { DataEntity as DataEntityInner } from 'ero-like-sdk/dist/data.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('data')
export class DataEntity extends DataEntityInner {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  declare id: string;

  @CreateDateColumn()
  @ApiProperty()
  declare createdAt: Date;

  @Column()
  declare type: string;

  @Column()
  declare mime: string;

  @Column({ type: 'bytea' })
  declare sha256: string;

  @ApiProperty()
  @Column({ type: 'text' })
  declare clearSignDataPart: string;
}
