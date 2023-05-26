// should be imported from API or somewhere else

interface ReportAlpha1 {
  id: string;
  signature: {
    id: string;
    user: {
      id: string;
      nick: string;
    };
  };
  d: {
    dateTimestamp: number;
    title: string;
    background: string;
    substances: Array<{
      timeSecond: number;
      namePsychonautWikiOrg: string;
      routeOfAdministration: string;
      doseUnit: string;
      dose: number;
    }>;
    timeLineReport: Array<{timeSecond: number; report: string}>;
  };
  gpgSignature: string;
  createdAt: string;
}

export type Report = ReportAlpha1
export type FilterRecordPair<T> = {
  value: T|null;
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
