export const REPORTS = 'data';
export const PAGINATION = 'pagination';
export const IS_LOADING = 'isLoading';
export const FETCHED_PAGES = 'fetchedPages';

// should be imported from API or somewhere else
export interface Report {
  title: string;
  nick: string;
  gpgSignature: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  itemsTotal: number;
}

export interface IsLoading {
  isLoading: boolean;
}

export interface FetchedPage {
  reports: Array<Report>;
  pagination: Pagination;
}

export interface State {
  [REPORTS]: Array<Report>;
  [PAGINATION]: Pagination;
  [IS_LOADING]: IsLoading;
  [FETCHED_PAGES]: Array<FetchedPage>;
}

export default {
  [REPORTS]: [],
  [PAGINATION]: {
    page: 0,
    pageSize: 10,
    itemsTotal: 0,
  },
  [IS_LOADING]: {
    isLoading: false,
  },
  [FETCHED_PAGES]: [],
} as State;
