import { ActionContext } from 'vuex';
import api from '@/services/api';
import { Pagination } from './state';
import { SET_DATA, SET_PAGINATION } from './mutations';

export const FETCH_REPORTS = 'load_reports';

export default {
  async [FETCH_REPORTS]({ commit }: ActionContext<unknown, unknown>, payload: Pagination) {
    console.log(payload);
    const data = await api.fetchReports(
      payload.page,
      payload.pageSize,
    );

    commit(SET_DATA, data.items);
    commit(SET_PAGINATION, {
      page: data.page,
      pageSize: data.pageSize,
      itemsTotal: data.itemsTotal,
    });
  },
};
