import { State, Pagination, Report } from './state';

export const SET_PAGINATION = 'set_pagination';
export const SET_DATA = 'set_data';

export default {
  [SET_PAGINATION](state: State, pagination: Pagination) {
    state.pagination = pagination;
  },

  [SET_DATA](state: State, data: Array<Report>) {
    state.data = data;
  },
};
