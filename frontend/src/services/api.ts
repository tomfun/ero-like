// should be imported from API or somewhere else

export interface PsychonautWikiSubstance {
  name: string;
  summary: string;
  addictionPotential: string;
  toxicity: string[];
  crossTolerances: string[];
  commonNames: string[] | null;
}

export interface ReportSubstanceAlpha1 {
  timeSecond: number;
  namePsychonautWikiOrg: string;
  routeOfAdministration: string;
  doseUnit: string;
  dose: number;
  surePercent: number;
}

export interface ReportTimeLineItemAlpha1 {
  timeSecond: number;
  report: string;
}

export interface ReportDataAlpha1 {
  dateTimestamp: number;
  title: string;
  background: string;
  substances: ReportSubstanceAlpha1[];
  timeLineReport: Array<{ timeSecond: number; report: string }>;
}

interface ReportAlpha1 {
  id: string;
  signature: {
    id: string;
    signedAt?: string;
    user: {
      id: string;
      nick: string;
      createdAt: string;
    };
  };
  d: ReportDataAlpha1;
  gpgSignature: string;
  createdAt: string;
}

export type Report = ReportAlpha1
export type FilterRecordPair<T> = {
  value: T | null;
  matchMode: 'startsWith' | 'contains' | 'notContains' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | 'between' | 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter';
}

export interface ReportFilters {
  'signature.user.nick': FilterRecordPair<string>;
  'd.title': FilterRecordPair<string>;
  'd.substances.*.namePsychonautWikiOrg': FilterRecordPair<string>;
  'd.dateTimestamp': FilterRecordPair<number>;
}

export default {
  async fetchReports(
    { page, pageSize, filters }:
      {
        page: number;
        pageSize: number;
        filters: ReportFilters;
      },
  ):
    Promise<{
      page: number;
      pageSize: number;
      itemsTotal: number;
      items: Array<Report>;
      encodedQuery: string;
    }> {
    const queryStringParts = [];
    if (page !== undefined) {
      queryStringParts.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      queryStringParts.push(`pageSize=${pageSize}`);
    }
    const filtersEncoded = (Object.keys(filters) as Array<keyof ReportFilters>)
      .filter((field) => filters[field].value !== null)
      .map((field) => {
        let fieldPath: string;
        if (field === 'd.substances.*.namePsychonautWikiOrg') {
          fieldPath = '[d][substances.*.namePsychonautWikiOrg]';
        } else {
          fieldPath = field.split('.').map((f, i) => (i ? `[${f}]` : f)).join('');
        }
        return `${fieldPath}[${filters[field].matchMode}]=${encodeURIComponent(filters[field].value as string)}`;
      });
    const encodedQuery = queryStringParts.concat(filtersEncoded).join('&');
    const uri = `/api/report?${encodedQuery}`;
    if (uri.length > 2000) {
      // eslint-disable-next-line no-console
      console.error('uri too long');
    }
    const res = await fetch(uri);
    const body = await res.json();
    if (res.status > 400) {
      throw new Error(`API error: ${body.message || 'unknown'}`);
    }
    return {
      ...body,
      encodedQuery,
    };
  },
  async fetchReport(id: string): Promise<Report> {
    const res = await fetch(`/api/report/${id}`);
    return await res.json();
  }
};

export async function fetchPsychonautWikiSubstanceList(): Promise<PsychonautWikiSubstance[]> {
  const res = await fetch('/api/psychonautwiki/substance');
  const body = await res.json();
  if (res.status > 400) {
    throw new Error(`API error: ${body.message || 'unknown'}`);
  }
  return body;
}

export class ApiError extends Error {
}

export class BadRequestError extends ApiError {
  constructor(public readonly errors: string[]) {
    super();
  }
}

export async function reportDataValidation(report: ReportDataAlpha1) {
  const res = await fetch('/api/report/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  })
  if (res.ok && res.status === 200) {
    return await res.text();
  }
  if (res.status === 400) {
    const { message } = await res.json();
    throw new BadRequestError(typeof message === 'string' ? [message] : message)
  }
  throw new ApiError(`Invalid API response status (${res.status})`)
}

export async function reportSubmit(reportClearSignArmored: string) {
  const res = await fetch('/api/report', {
    method: 'PATCH',
    headers: { 'Content-Type': 'text/plain' },
    body: reportClearSignArmored,
  })
  if (res.ok && res.status === 200) {
    return await res.json();
  }
  if (res.status === 400) {
    const { message } = await res.json();
    throw new BadRequestError(typeof message === 'string' ? [message] : message)
  }
  throw new ApiError(`Invalid API response status (${res.status})`)
}

export async function userRegister({ publicKeyArmored, clearSignArmored }: {
  publicKeyArmored: string,
  clearSignArmored: string
}, check?: boolean) {
  const res = await fetch(`/api/user${check ? '/dry-run' : ''}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKeyArmored, clearSignArmored }),
  });
  if (res.status === 400) {
    const { message } = await res.json();
    throw new BadRequestError(typeof message === 'string' ? [message] : message)
  }
  if (res.status !== 200) {
    throw new ApiError(`Invalid API response status (${res.status})`) // todo: localization
  }
  return await res.json();
}
