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
        nick: { value: string | undefined; type: string };
        title: { value: string | undefined; type: string };
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
    const filtersEncoded = ['nick' as const, 'title' as const]
      .filter((field) => filters[field].value !== undefined)
      .map((field) => `${field}[${filters[field].type}]=${encodeURIComponent(filters[field].value as string)}`);
    const uri = `/api/report?${queryStringParts.concat(filtersEncoded).join('&')}`;
    if (uri.length > 2000) {
      // eslint-disable-next-line no-console
      console.error('uri too long');
    }
    const res = await fetch(uri);
    return res.json(); // why we don't handle an error case?
  },
};
