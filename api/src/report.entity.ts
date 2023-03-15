import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { SignatureEntity } from './signature.entity';
import { UserEntity } from './user.entity';

export class ReportDataSubstanceBodyPayload {
  @IsInt()
  @Min(0)
  @Max(7 * 24 * 3600)
  timeSecond: number;

  // todo
  namePsychonautWikiOrg: string;

  @IsNumber()
  @Min(Number.MIN_VALUE)
  @Max(70 * 1000 * 1000 * 1000)
  dose: number;

  @IsIn(['mg', 'µg', 'g'])
  doseUnit: string;

  // todo: array
  // doseOf: string;
  // coefficientToGram: number;
  // coefficientToGramActiveSubstancePsychonautWikiOrg: string;

  // todo: add more https://psychonautwiki.org/wiki/Routes_of_administration#Oral
  @IsIn([
    'oral',
    'sublingual',
    'insufflated',
    'intravenous',
    'smoked',
    'rectal',
    'transdermal',
  ])
  routeOfAdministration: string;

  @IsInt()
  @Min(0)
  @Max(100)
  surePercent: number;
}

export class ReportDataUserBodyPayload {
  @IsInt()
  @Min(0)
  @Max(100)
  ageYear: number;

  @IsInt()
  @Min(0)
  @Max(100)
  isMale: number;

  @IsInt()
  @Min(0)
  @Max(300)
  heightMeter: number;

  @IsInt()
  @Min(0)
  @Max(300)
  weightGram: number;

  @Length(3, 3)
  country: string;
}

export class ReportDataTimeLineReportBodyPayload {
  @IsInt()
  @Min(0)
  @Max(7 * 24 * 3600)
  timeSecond: number;

  @Length(4, 20000)
  report: string;
}

/**
 * Is not true class. It is not used. But type the same
 */
export class ReportDataBodyPayload {
  @Length(4, 250)
  title: string;

  // https://psychonautwiki.org/wiki/Psychoactive_substance_index
  @ValidateNested()
  @IsArray()
  @Type(() => ReportDataSubstanceBodyPayload)
  substances: Array<ReportDataSubstanceBodyPayload>;

  @ValidateNested()
  @Type(() => ReportDataUserBodyPayload)
  user: ReportDataUserBodyPayload;

  @Length(4, 250)
  background: string;

  @IsOptional()
  @Length(4, 20000)
  generalReport: string;

  @ValidateNested()
  @IsArray()
  @Type(() => ReportDataTimeLineReportBodyPayload)
  timeLineReport: Array<ReportDataTimeLineReportBodyPayload>;

  @IsInt()
  dateTimestamp: number;
  // todo: effect, tolerance
  // https://psychonautwiki.org/wiki/Experience_index
}

@Entity('report')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class ReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => SignatureEntity)
  signature: SignatureEntity;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'jsonb' })
  d: ReportDataBodyPayload;
}
