import { ApiProperty } from '@nestjs/swagger';
import {
  ReportEntity as ReportEntityInner,
  ReportDataSubstanceBodyPayload as ReportDataSubstanceBodyPayloadInner,
  ReportDataUserBodyPayload as ReportDataUserBodyPayloadInner,
  ReportDataTimeLineReportBodyPayload as ReportDataTimeLineReportBodyPayloadInner,
  ReportDataBodyPayload as ReportDataBodyPayloadInner,
} from 'ero-like-sdk/dist/report.entity';
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

export class ReportDataSubstanceBodyPayload extends ReportDataSubstanceBodyPayloadInner {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(7 * 24 * 3600)
  declare timeSecond: number;

  // todo
  @ApiProperty()
  @IsIn(['heroin', '2C-B', '2C-I', 'DOB', 'LSA', 'LSD', 'MDMA'])
  declare namePsychonautWikiOrg: string;

  @ApiProperty()
  @IsNumber()
  @Min(Number.MIN_VALUE)
  @Max(70 * 1000 * 1000 * 1000)
  declare dose: number;

  @ApiProperty()
  @IsIn(['mg', 'µg', 'g'])
  declare doseUnit: string;

  // activeSubstance
  // todo: array
  // doseOf: string;
  // coefficientToGram: number;
  // coefficientToGramActiveSubstancePsychonautWikiOrg: string;

  // todo: add more https://psychonautwiki.org/wiki/Routes_of_administration#Oral
  @ApiProperty()
  @IsIn([
    'oral',
    'sublingual',
    'insufflated',
    'intravenous',
    'smoked',
    'rectal',
    'transdermal',
  ])
  declare routeOfAdministration: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  declare surePercent: number;
}

export class ReportDataUserBodyPayload extends ReportDataUserBodyPayloadInner {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  declare ageYear: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  declare isMale: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(300)
  declare heightMeter: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(300)
  declare weightGram: number;

  @ApiProperty()
  @Length(3, 3)
  declare country: string;
}

export class ReportDataTimeLineReportBodyPayload extends ReportDataTimeLineReportBodyPayloadInner {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(7 * 24 * 3600)
  declare timeSecond: number;

  @ApiProperty()
  @Length(4, 20000)
  declare report: string;
}

/**
 * Is not true class. It is not used. But type the same
 */
export class ReportDataBodyPayload extends ReportDataBodyPayloadInner {
  @ApiProperty()
  @Length(4, 250)
  declare title: string;

  // https://psychonautwiki.org/wiki/Psychoactive_substance_index
  @ApiProperty({ type: [ReportDataSubstanceBodyPayload] })
  @ValidateNested()
  @IsArray()
  @Type(() => ReportDataSubstanceBodyPayload)
  declare substances: Array<ReportDataSubstanceBodyPayload>;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ReportDataUserBodyPayload)
  declare user: ReportDataUserBodyPayload;

  @ApiProperty()
  @Length(4, 250)
  declare background: string;

  @ApiProperty()
  @IsOptional()
  @Length(4, 20000)
  declare generalReport: string;

  @ApiProperty({ type: [ReportDataTimeLineReportBodyPayload] })
  @ValidateNested()
  @IsArray()
  @Type(() => ReportDataTimeLineReportBodyPayload)
  declare timeLineReport: Array<ReportDataTimeLineReportBodyPayload>;

  @ApiProperty()
  @IsInt()
  declare dateTimestamp: number;
  // todo: effect, tolerance
  // https://psychonautwiki.org/wiki/Experience_index
}

@Entity('report')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class ReportEntity extends ReportEntityInner {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity)
  declare user: UserEntity;

  @ManyToOne(() => SignatureEntity)
  declare signature: SignatureEntity;

  @ApiProperty()
  @CreateDateColumn()
  declare createdAt: Date;

  @ApiProperty()
  @Column({ type: 'jsonb' })
  declare d: ReportDataBodyPayload;
}
