import type { ReportFilters, Report as ApiFetchReport } from '../../services/api';

export const REPORTS = 'data';
export const PAGINATION = 'pagination';
export const IS_LOADING = 'isLoading';

export type Report = ApiFetchReport;

export interface Reports {
  [id: string]: Report;
}

export interface Pagination {
  page: number;
  pageSize: number;
  itemsTotal: number;
  order: {
    id: 1|-1;
  };
  ids: Array<string>;
  viewIds: Array<string>;
  filters: ReportFilters;
  encodedQuery: string;
}

export interface IsLoading {
  isLoading: boolean;
}

export interface State {
  [REPORTS]: Reports;
  [PAGINATION]: Pagination;
  [IS_LOADING]: IsLoading;
}

export default {
  [REPORTS]: {} as Reports,
  [PAGINATION]: {
    page: 0,
    pageSize: 10,
    itemsTotal: 0,
    order: {
      id: 1,
    },
    ids: [],
    viewIds: [],
    filters: {
      'user.nick': {
        value: null,
        matchMode: 'equals',
      },
      'd.dateTimestamp': {
        value: null,
        matchMode: 'equals',
      },
      'd.title': {
        value: null,
        matchMode: 'equals',
      },
      'd.substances.*.namePsychonautWikiOrg': {
        value: null,
        matchMode: 'equals',
      },
    },
    encodedQuery: '',
  },
  [IS_LOADING]: {
    isLoading: false,
  },
} as State;
