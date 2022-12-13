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
      filters: { nick: { value: string | undefined; type: string }}; },
  ):
  Promise<{
    page: number;
    pageSize: number;
    itemsTotal: number;
    items: Array<Report>;
  }> {
    const curPage = (page === undefined) ? '' : `page=${page}`;
    const curPageSize = (pageSize === undefined) ? '' : `pageSize=${pageSize}`;
    const curFilter = filters ? `&nick[${filters.nick.type}]=${filters.nick.value}` : '';
    const res = await fetch(`/api/report?${curPage}&${curPageSize}${curFilter.length > 0 ? curFilter : ''}`);
    return res.json(); // why we don't handle an error case?
  },
};
