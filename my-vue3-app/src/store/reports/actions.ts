import { ActionContext } from 'vuex';
import api from '@/services/api';
import { Pagination } from './state';
import {
  SET_DATA, SET_PAGINATION, SET_LOADING, SET_FETCHED_PAGE,
} from './mutations';

export const FETCH_REPORTS = 'load_reports';

export default {
  async [FETCH_REPORTS]({ commit }: ActionContext<unknown, unknown>, payload: Pagination) {
    commit(SET_LOADING, true);
    try {
      const data = await api.fetchReports(payload);
      commit(SET_DATA, data.items);
      commit(SET_PAGINATION, {
        page: data.page,
        pageSize: data.pageSize,
        itemsTotal: data.itemsTotal,
      });
      commit(SET_FETCHED_PAGE, {
        reports: data.items,
        pagination: {
          page: data.page,
          pageSize: data.pageSize,
          itemsTotal: data.itemsTotal,
        },
      });
    } finally {
      commit(SET_LOADING, false);
    }
  },
};
