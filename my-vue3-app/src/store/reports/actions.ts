import { ActionContext } from 'vuex';
import api from '../../services/api';
import {
  PAGINATION, Pagination, Reports, REPORTS, State,
} from './state';
import {
  ADD_DATA, SET_PAGINATION, SET_LOADING,
} from './mutations';

export const FETCH_REPORTS = 'load_reports';

const filterReport = (value: unknown, filter: {value: string; type: string}): boolean => {
  switch (filter.type) {
    case 'equal':
      return value === filter.value;
    case 'start':
      return typeof value === 'string' && value.startsWith(filter.value);
    default:
      return true;
  }
};

const applyFilterSortToReports = (
  pagination: Pick<Pagination, 'order' | 'filters'>,
  reports: Reports,
  desired: Omit<Pagination, 'viewIds'|'ids'>,
): Array<string> => {
  const ids = Object.keys(reports);
  const filterFields = ['nick' as 'nick', 'title' as 'title']
    .filter((field) => desired.filters[field].value !== undefined);
  const filtered = desired.filters && desired.filters.nick
    ? ids
      .map((id) => reports[id])
      .filter((report) => filterFields.reduce((ok, field) => ok
          && filterReport(report[field], desired.filters[field] as { value: string; type: string }),
        true as boolean))
      .map((report) => report.id)
    : ids;
  return filtered.sort((a, b) => a.localeCompare(b) * pagination.order.id);
};

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

let fetchReportsConsistentlyPromiseCallCount = 0;

export default {
  async [FETCH_REPORTS](
    { commit, state }: ActionContext<State, unknown>,
    desired: Omit<Pagination, 'viewIds'|'ids'>,
  ) {
    commit(SET_LOADING, true);
    const pagination = state[PAGINATION];
    const localReportIds = applyFilterSortToReports(pagination, state[REPORTS], desired);
    let localIndexDesired = calcLocalIndex({
      pagination,
      desired,
      localReportIds,
    });
    let desiredPageSize = desired.pageSize;
    if (desired.page === undefined || desired.pageSize === undefined) {
      localIndexDesired = 0;
      desiredPageSize = pagination.pageSize;
    }
    commit(SET_PAGINATION, {
      ...pagination,
      viewIds: localReportIds.slice(localIndexDesired, localIndexDesired + desiredPageSize),
    });

    fetchReportsConsistentlyPromiseCallCount += 1;
    const dataPromiseCallCount = fetchReportsConsistentlyPromiseCallCount;
    try {
      const data = await api.fetchReports(desired);
      commit(ADD_DATA, data.items);
      if (dataPromiseCallCount !== fetchReportsConsistentlyPromiseCallCount) {
        return;
      }

      const ids = data.items.map((r) => r.id);
      commit(SET_PAGINATION, {
        ...pagination,
        ...desired,
        page: data.page,
        pageSize: data.pageSize,
        itemsTotal: data.itemsTotal,
        // sort: '',
        ids,
        viewIds: ids,
      });
    } finally {
      if (dataPromiseCallCount === fetchReportsConsistentlyPromiseCallCount) {
        commit(SET_LOADING, false);
      }
    }
  },

};
