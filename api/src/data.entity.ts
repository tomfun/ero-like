import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('data')
export class DataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  type: string;

  @Column()
  mime: string;

  @Column({ type: 'bytea' })
  sha256: string;

  @Column({ type: 'text' })
  clearSignDataPart: string;
}
