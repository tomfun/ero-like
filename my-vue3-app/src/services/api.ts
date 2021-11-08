// should be imported from API or somewhere else
export interface Report {
  id: string;
  title: string;
  nick: string;
  gpgSignature: string;
}
export default {
  async fetchReports({ page, pageSize }: {page: number; pageSize: number}): Promise<{
    page: number;
    pageSize: number;
    itemsTotal: number;
    items: Array<Report>;
  }> {
    const res = await fetch(`/api/report?page=${page}&pageSize=${pageSize}`);
    return res.json();
  },
};
