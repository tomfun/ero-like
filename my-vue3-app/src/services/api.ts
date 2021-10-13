export default {
  async fetchReports(page: number, pageSize: number) {
    const res = await fetch(`/api/report?page=${page}&pageSize=${pageSize}`);
    return res.json();
  },
}