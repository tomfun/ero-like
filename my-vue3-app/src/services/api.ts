// should be imported from API or somewhere else

export interface Report {
  id: string;
  title: string;
  nick: string;
  gpgSignature: string;
}

function extractNick(filters: object) {
  return Object.values(filters);
  // return nick
}

export default {
  async fetchReports(
    { page, pageSize, filters }:
    {page: number; pageSize: number; filters: object},
  ):
  Promise<{
    page: number;
    pageSize: number;
    itemsTotal: number;
    items: Array<Report>;
  }> {
    const res = await fetch(`/api/report?page=${page}&pageSize=${pageSize}${filters ? `&nick=${extractNick(filters)}` : ''}`);
    return res.json();
  },
};
