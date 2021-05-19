import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  Allow,
} from 'class-validator';

export class ReportBodyPayload {
  @Length(4, 250)
  title: string;

  @Length(4, 48)
  nick: string;

  // @Length(4)
  gpgSignature: string;
}

export interface ReportForList {
  id: string;
  substances: Array<{
    name: string;
    activeSubstance: string;
    sure: number;
  }>;
  title: string;
  nick: string;
  gpgSignature: string;
}

@Entity('report')
export class ReportEntity extends ReportBodyPayload implements ReportForList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  substances: Array<{
    name: string;
    activeSubstance: string;
    sure: number;
  }>;

  @Column()
  title: string;

  @Column()
  nick: string;

  @Column()
  gpgSignature: string = '';

  // @Column()
  // @IsInt()
  // @Min(0)
  // age: number;

  // @Column()
  // @IsDate()
  // createDate: Date;
}
