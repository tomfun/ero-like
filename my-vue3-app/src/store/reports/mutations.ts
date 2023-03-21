import {
  IsLoading, Pagination, Report, REPORTS, State,
} from './state';

export const SET_PAGINATION = 'set_pagination';
export const ADD_DATA = 'add_data';
export const SET_LOADING = 'set_loading';

export default {
  [SET_PAGINATION](state: State, pagination: Pagination) {
    state.pagination = pagination;
    state.pagination.filters['user.nick'] = pagination.filters['user.nick'];
    state.pagination.filters['d.title'] = pagination.filters['d.title'];
  },

  [ADD_DATA](state: State, data: Array<Report>) {
    data.forEach((report) => {
      state[REPORTS][report.id] = report;
    });
  },

  [SET_LOADING](state: State, isLoading: IsLoading) {
    state.isLoading = isLoading;
  },
};
