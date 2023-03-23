import { Report as ApiFetchReport } from '@/services/api';

export const REPORTS = 'data';
export const PAGINATION = 'pagination';
export const IS_LOADING = 'isLoading';
export const URL = 'url';

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
    nick: {
      value: string | undefined;
      matchMode: string;
    };
    title: {
      value: string | undefined;
      matchMode: string;
    };
  };
}

export interface IsLoading {
  isLoading: boolean;
}

export interface URL {
  url: string;
}

export interface State {
  [REPORTS]: Reports;
  [PAGINATION]: Pagination;
  [IS_LOADING]: IsLoading;
  [URL]: URL;
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
      nick: {
        value: undefined,
        matchMode: '',
      },
      title: {
        value: undefined,
        matchMode: '',
      },
    },
  },
  [IS_LOADING]: {
    isLoading: false,
  },
  [URL]: {
    url: '',
  },
} as State;
