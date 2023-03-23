// should be imported from API or somewhere else

export interface Report {
  id: string;
  title: string;
  nick: string;
  gpgSignature: string;
}

export default {
  async fetchReports(
    { page, pageSize, filters }:
    {
      page: number;
      pageSize: number;
      filters: {
        nick: { value: string | undefined; matchMode: string };
        title: { value: string | undefined; matchMode: string };
      };
    },
  ):
  Promise<{
    page: number;
    pageSize: number;
    itemsTotal: number;
    items: Array<Report>;
    url: string;
  }> {
    const queryStringParts = [];
    if (page !== undefined) {
      queryStringParts.push(`page=${page}`);
    }
    if (pageSize !== undefined) {
      queryStringParts.push(`pageSize=${pageSize}`);
    }
    const filtersEncoded = ['nick' as const, 'title' as const]
      .filter((field) => filters[field].value !== undefined)
      .map((field) => `${field}[${filters[field].matchMode}]=${encodeURIComponent(filters[field].value as string)}`);
    const uriState = queryStringParts.concat(filtersEncoded).join('&');
    const uri = `/api/report?${uriState}`;
    if (uri.length > 2000) {
      // eslint-disable-next-line no-console
      console.error('uri too long');
    }
    const res = await fetch(uri);
    const body = await res.json();
    const resp = {
      ...body,
      url: uriState,
    };
    return resp; // why we don't handle an error case?
  },
};
