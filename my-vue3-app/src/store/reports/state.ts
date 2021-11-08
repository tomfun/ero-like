export const REPORTS = 'data';
export const PAGINATION = 'pagination';
export const IS_LOADING = 'isLoading';
export const REPORT_STORAGE = 'reportStorage';

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

export interface ReportInStorage {
  report: Report;
  reportId: number;
}

export interface State {
  [REPORTS]: Array<Report>;
  [PAGINATION]: Pagination;
  [IS_LOADING]: IsLoading;
  [REPORT_STORAGE]: Array<ReportInStorage>;
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
  [REPORT_STORAGE]: [],
} as State;
