// should be imported from API or somewhere else

interface ReportAlpha1 {
  id: string;
  user: {
    id: string;
    nick: string;
  };
  d: {
    dateTimestamp: number;
    title: string;
    background: string;
    substances: Array<{
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

export default {
  async fetchReports(
    { page, pageSize, filters }:
    {
      page: number;
      pageSize: number;
      filters: {
        user: {
          nick: { value: string | undefined; matchMode: string };
        };
        d: {
          dateTimestamp: { value: number | undefined; matchMode: string };
          title: { value: string | undefined; matchMode: string };
          'substances.*.namePsychonautWikiOrg': { value: string | undefined; matchMode: string };
        };
      };
    },
  ):
  Promise<{
    page: number;
    pageSize: number;
    itemsTotal: number;
    items: Array<Report>;
  }> {
    const queryStringParts = [];
    if (page !== undefined) {
      queryStringParts.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      queryStringParts.push(`pageSize=${pageSize}`);
    }
    const filtersEncoded = ['title' as const] // todo
      .filter((field) => filters.d[field].value !== undefined)
      .map((field) => `${field}[${filters.d[field].matchMode}]=${encodeURIComponent(filters.d[field].value as string)}`);
    const uri = `/api/report?${queryStringParts.concat(filtersEncoded).join('&')}`;
    if (uri.length > 2000) {
      // eslint-disable-next-line no-console
      console.error('uri too long');
    }
    const res = await fetch(uri);
    return res.json(); // why we don't handle an error case?
  },
};
