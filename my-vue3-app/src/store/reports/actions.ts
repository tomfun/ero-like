import { ActionContext } from 'vuex';
import api from '@/services/api';
import { Pagination, Report, State } from './state';
import {
  SET_DATA, SET_PAGINATION, SET_LOADING, SET_REPORT_IN_STORAGE,
} from './mutations';

export const FETCH_REPORTS = 'load_reports';

export default {
  async [FETCH_REPORTS]({ commit, state }: ActionContext<State, unknown>, payload: Pagination) {
    commit(SET_LOADING, true);
    try {
      const data = await api.fetchReports(payload);
      commit(SET_DATA, data.items);
      commit(SET_PAGINATION, {
        page: data.page,
        pageSize: data.pageSize,
        itemsTotal: data.itemsTotal,
      });
      data.items.forEach((report: Report, index: number) => {
        const currentIndex = data.pageSize * data.page + index;
        const reportExist = state.reportStorage.find((item) => item.reportId === currentIndex);
        if (reportExist === undefined) {
          commit(SET_REPORT_IN_STORAGE, {
            report,
            reportId: data.pageSize * data.page + index,
          });
        }
      });
    } finally {
      commit(SET_LOADING, false);
    }
  },
};
