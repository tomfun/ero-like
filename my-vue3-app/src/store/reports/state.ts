import { Report as ApiFetchReport } from '@/services/api';

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
  filters: {
    'user.nick': {
      value: string | undefined;
      matchMode: string;
    };
    'd.dateTimestamp': {
      value: number | undefined;
      matchMode: string;
    };
    'd.title': {
      value: string | undefined;
      matchMode: string;
    };
    'd.substances.*.namePsychonautWikiOrg': {
      value: string | undefined;
      matchMode: string;
    };
  };
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
        value: undefined,
        matchMode: '',
      },
      'd.dateTimestamp': {
        value: undefined,
        matchMode: '',
      },
      'd.title': {
        value: undefined,
        matchMode: '',
      },
      'd.substances.*.namePsychonautWikiOrg': {
        value: undefined,
        matchMode: '',
      },
    },
  },
  [IS_LOADING]: {
    isLoading: false,
  },
} as State;
