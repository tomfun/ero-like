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
  [REPORTS]: [
    {
      title: 'Title',
      nick: 'Nick',
      gpgSignature: 'string',
    },
  ],
  [PAGINATION]: {
    page: 0,
    pageSize: 10,
    itemsTotal: 133,
  },
} as State;
