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
    console.log(filters);
    const curPage = (page === undefined) ? '' : `page=${page}`;
    const curPageSize = (pageSize === undefined) ? '' : `pageSize=${pageSize}`;
    // we need to handle strings with spaces without letters;
    const curNickFilter = (filters !== undefined && filters.nick.value !== undefined && filters.nick.value.length > 0) ? `&nick[${filters.nick.type}]=${filters.nick.value}` : '';
    const curTitleFilter = (filters !== undefined && filters.title.value !== undefined && filters.title.value.length > 0) ? `&title[${filters.title.type}]=${filters.title.value}` : '';
    const res = await fetch(`/api/report?${curPage}&${curPageSize}${curNickFilter.length > 0 ? curNickFilter : ''}${curTitleFilter.length > 0 ? curTitleFilter : ''}`);
    return res.json(); // why we don't handle an error case?
  },
};
