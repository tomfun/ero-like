import {
  IsLoading, Pagination, Report, REPORTS, State, URL,
} from './state';

export const SET_PAGINATION = 'set_pagination';
export const ADD_DATA = 'add_data';
export const SET_LOADING = 'set_loading';
export const SET_URL = 'set_url';

export default {
  [SET_PAGINATION](state: State, pagination: Pagination) {
    state.pagination = pagination;
    state.pagination.filters.nick = pagination.filters.nick;
    state.pagination.filters.title = pagination.filters.title;
  },

  [ADD_DATA](state: State, data: Array<Report>) {
    data.forEach((report) => {
      state[REPORTS][report.id] = report;
    });
  },

  [SET_LOADING](state: State, isLoading: IsLoading) {
    state.isLoading = isLoading;
  },

  [SET_URL](state: State, Url: URL) {
    state.url = Url;
  },
};
