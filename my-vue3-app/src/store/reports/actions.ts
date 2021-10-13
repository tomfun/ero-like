import api from "@/services/api";
import {
    SET_DATA,
    SET_PAGINATION,
  } from './mutations'
import state, { PAGINATION } from './state';

export const FETCH_REPORTS = 'load_reports';

export default {
    async [FETCH_REPORTS]({ commit }: any, payload: any) {
    const data = await api.fetchReports(
        state[PAGINATION].page,
        state[PAGINATION].pageSize
    )

    commit(SET_DATA, data.items)
    commit(SET_PAGINATION, {
      page: data.page,
      pageSize: data.pageSize,
      itemsTotal : data.itemsTotal,
    })
  },
}