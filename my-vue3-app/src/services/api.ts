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
    {page: number; pageSize: number; filters: {nick: string}},
  ):
  Promise<{
    page: number;
    pageSize: number;
    itemsTotal: number;
    items: Array<Report>;
  }> {
    const curPage = (page === undefined) ? '' : `page=${page}`;
    const curPageSize = (pageSize === undefined) ? '' : `pageSize=${pageSize}`;
    const curFilter = filters ? `nick=${filters.nick}` : '';
    const res = await fetch(`/api/report?${curPage}&${curPageSize}&${curFilter}`);
    return res.json();
  },
};
