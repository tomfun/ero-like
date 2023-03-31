import { SignatureEntity } from './signature.entity';
import { UserEntity } from './user.entity';

export class ReportDataSubstanceBodyPayload {
  timeSecond: number;

  namePsychonautWikiOrg: string;

  dose: number;

  doseUnit: string;

  // activeSubstance
  // todo: array
  // doseOf: string;
  // coefficientToGram: number;
  // coefficientToGramActiveSubstancePsychonautWikiOrg: string;

  routeOfAdministration: string;

  surePercent: number;
}

export class ReportDataUserBodyPayload {
  ageYear: number;

  isMale: number;

  heightMeter: number;

  weightGram: number;

  country: string;
}

export class ReportDataTimeLineReportBodyPayload {
  timeSecond: number;

  report: string;
}

/**
 * Is not true class. It is not used. But type the same
 */
export class ReportDataBodyPayload {
  title: string;

  substances: Array<ReportDataSubstanceBodyPayload>;

  user: ReportDataUserBodyPayload;

  background: string;

  generalReport: string;

  timeLineReport: Array<ReportDataTimeLineReportBodyPayload>;

  dateTimestamp: number;
  // todo: effect, tolerance
  // https://psychonautwiki.org/wiki/Experience_index
}

export class ReportEntity {
  id: string;

  user: UserEntity;

  signature: SignatureEntity;

  createdAt: Date;

  d: ReportDataBodyPayload;
}
