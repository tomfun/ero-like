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
  [PAGINATION]: {
    page: number;
    pageSize: number;
    itemsTotal: number;
  };
}

export default {
  [REPORTS]: [],
  [PAGINATION]: {
    page: 1,
    pageSize: 10,
    itemsTotal: 13,
  },
} as State;
