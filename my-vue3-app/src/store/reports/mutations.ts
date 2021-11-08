import {
  State, Pagination, Report, IsLoading, ReportInStorage,
} from './state';

export const SET_PAGINATION = 'set_pagination';
export const SET_DATA = 'set_data';
export const SET_LOADING = 'set_loading';
export const SET_REPORT_IN_STORAGE = 'set_report_in_storage';

export default {
  [SET_PAGINATION](state: State, pagination: Pagination) {
    state.pagination = pagination;
  },

  [SET_DATA](state: State, data: Array<Report>) {
    state.data = data;
  },

  [SET_LOADING](state: State, isLoading: IsLoading) {
    state.isLoading = isLoading;
  },

  [SET_REPORT_IN_STORAGE](state: State, reportInStorage: ReportInStorage) {
    state.reportStorage.push(reportInStorage);
  },

};
