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

const calcLocalIndex = ({ pagination, desired, localReportIds }: {
  pagination: Pagination;
  desired: Pick<Pagination, 'page'|'pageSize'>;
  localReportIds: string[];
}) => {
  const remoteIndex = pagination.page * pagination.pageSize;
  const localIndex = localReportIds.indexOf(pagination.ids[0]);
  const remoteIndexDesired = desired.page * desired.pageSize;
  const remoteIndexShift = remoteIndexDesired - remoteIndex;
  const localIndexShift = remoteIndexShift; // guess. we made assumption
  const localIndexDesired = localIndex + localIndexShift;
  return localIndexDesired;
};

export default {
  async [FETCH_REPORTS](
    { commit, state }: ActionContext<State, unknown>,
    desired: Omit<Pagination, 'viewIds'|'ids'>,
  ) {
    commit(SET_LOADING, true);

    const { pagination } = state;
    const localReportIds = applyFilterSortToReports(pagination, state[REPORTS]);
    const localIndexDesired = calcLocalIndex({
      pagination,
      desired,
      localReportIds,
    });
    commit(SET_PAGINATION, {
      ...state[PAGINATION],
      viewIds: localReportIds.slice(localIndexDesired, localIndexDesired + desired.pageSize),
    });

    try {
      const data = await api.fetchReports(desired);
      const ids = data.items.map((r) => r.id);
      commit(SET_PAGINATION, {
        ...state[PAGINATION],
        ...desired,
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
