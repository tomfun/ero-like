export const REPORTS = 'data';
export const PAGINATION = 'pagination';

// should be imported from API or somewhere else
export interface Report {
  title: string;
  nick: string;
  gpgSignature: string;
}

export interface State {
  [REPORTS]: Array<Report>;
  [PAGINATION]: Pagination;
}

export interface Pagination {
    page: number;
    pageSize: number;
    itemsTotal: number;
}

export default {
  [REPORTS]: [],
  [PAGINATION]: {
    page: 0,
    pageSize: 0,
    itemsTotal: 0,
  },
} as State;
