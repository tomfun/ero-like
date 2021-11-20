import { ActionContext } from 'vuex';
import api from '@/services/api';
import {
  PAGINATION, Pagination, Reports, REPORTS, State,
} from './state';
import {
  ADD_DATA, SET_PAGINATION, SET_LOADING,
} from './mutations';

export const FETCH_REPORTS = 'load_reports';

const applyFilterSortToReports = (
  pagination: Pick<Pagination, 'order'>,
  reports: Reports,
): Array<string> => Object
  .keys(reports)
  // .map((id) => reports[id]);
  // filter
  // .map((report) => report.id);
  .sort((a, b) => a.localeCompare(b) * pagination.order.id);

export default {
  async [FETCH_REPORTS](
    { commit, state }: ActionContext<State, unknown>,
    desired: Omit<Pagination, 'viewIds'|'ids'>,
  ) {
    commit(SET_LOADING, true);

    const { pagination } = state;
    const allReportIds = applyFilterSortToReports(pagination, state[REPORTS]);
    const indexShift = desired.page * desired.pageSize - pagination.page * pagination.pageSize;
    const remoteIndex = allReportIds.indexOf(pagination.ids[0]);
    const localIndex = remoteIndex + indexShift;
    console.log('index, indexShift, localIndex', remoteIndex, indexShift, localIndex);
    commit(SET_PAGINATION, {
      ...state[PAGINATION],
      viewIds: allReportIds.slice(localIndex, localIndex + desired.pageSize),
    });

    try {
      const data = await api.fetchReports(desired);
      const ids = data.items.map((r) => r.id);
      commit(SET_PAGINATION, {
        ...state[PAGINATION],
        page: data.page,
        pageSize: data.pageSize,
        itemsTotal: data.itemsTotal,
        // sort: '',
        // filter: '',
        ids,
        viewIds: ids,
      });
      commit(ADD_DATA, data.items);
    } finally {
      commit(SET_LOADING, false);
    }
  },
};
