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
  declare id: string;

  @CreateDateColumn()
  declare createdAt: Date;

  @Column()
  declare type: string;

  @Column()
  declare mime: string;

  @Column({ type: 'bytea' })
  declare sha256: string;

  @Column({ type: 'text' })
  declare clearSignDataPart: string;
}
