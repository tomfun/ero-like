import {
  State, Pagination, Report, IsLoading, FetchedPage,
} from './state';

export const SET_PAGINATION = 'set_pagination';
export const SET_DATA = 'set_data';
export const SET_LOADING = 'set_loading';
export const SET_FETCHED_PAGE = 'set_fetched_page';

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

  [SET_FETCHED_PAGE](state: State, fetchedPage: FetchedPage) {
    state.fetchedPages.push(fetchedPage);
  },

};
