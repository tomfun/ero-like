import { ActionContext } from 'vuex';
import { get } from 'lodash';
import api, { FilterRecordPair } from '../../services/api';
import {
  PAGINATION, Pagination, Report, Reports, REPORTS, State,
} from './state';
import {
  ADD_DATA, SET_PAGINATION, SET_LOADING,
} from './mutations';

export const FETCH_REPORTS = 'load_reports';

// type UnscopedPlainFilters<Type, K, FieldType, Prefix extends string> = {
//   // [`${Prefix}${K}`]: FilterRecordPair<FieldType>;
//   // Extract<Property, K>
//   [Property in keyof Type as `${Prefix}${Property}`]: FilterRecordPair<FieldType>
// };
const nothing = () => false;
type BuildReportsFiltersScopedString<ScopedReport, K extends keyof ScopedReport, FieldType> = (
  this: Record<string, FilterRecordPair<FieldType>>,
  prefix: string,
  fields: Array<K & string>,
) => Array<(r: ScopedReport) => boolean>;

function buildReportsFiltersScopedString<ScopedReport, K extends keyof ScopedReport>(
  this: Record<string, FilterRecordPair<string>>,
  prefix: string,
  fields: Array<K & string>,
): Array<(r: ScopedReport) => boolean> {
  return fields.reduce((
    filters: Array<(r: ScopedReport) => boolean>,
    field: K & string,
  ) => {
    const { value, matchMode } = this[prefix + field];
    if (value === null) {
      return filters;
    }
    let g: (r: ScopedReport) => ScopedReport[typeof field] | string;
    // 'd.substances.*.namePsychonautWikiOrg'
    if (field.includes('.*')) {
      const [array, endWithDot] = field.split('.*');
      if (endWithDot) {
        const end = endWithDot.replace(/^\./, '');
        g = (r: ScopedReport) => get(r, array).map((e: Record<string, string|number>) => e[end]).join(' ');
      } else {
        g = (r: ScopedReport) => get(r, array).join(' ');
      }
    } else {
      g = (r: ScopedReport) => get(r, field);
    }
    let newFilter: (r: ScopedReport) => boolean;
    switch (matchMode) {
      case 'equals':
        newFilter = (r: ScopedReport) => g(r) === value;
        break;
      case 'startsWith':
        newFilter = (r: ScopedReport) => (g(r) as string).startsWith(value);
        break;
      case 'endsWith':
        newFilter = (r: ScopedReport) => (g(r) as string).endsWith(value);
        break;
      case 'contains':
        newFilter = (r: ScopedReport) => (g(r) as string).includes(value);
        break;
      default:
        newFilter = nothing;
        break;
    }
    filters.push(newFilter);
    return filters;
  }, [] as Array<(r: ScopedReport) => boolean>);
}

function buildReportsFiltersScopedNumeric<ScopedReport, K extends keyof ScopedReport>(
  this: Record<string, FilterRecordPair<number>>,
  prefix: string,
  fields: Array<K & string>,
): Array<(r: ScopedReport) => boolean> {
  return fields.reduce((filters, field) => {
    const { value, matchMode } = this[prefix + field];
    if (value === null) {
      return filters;
    }
    const g = (r: ScopedReport) => get(r, field);
    let newFilter: (r: ScopedReport) => boolean;
    switch (matchMode) {
      case 'equals':
        newFilter = (r: ScopedReport) => g(r) === value;
        break;
      case 'lt':
        newFilter = (r: ScopedReport) => (+g(r)) < (value);
        break;
      case 'lte':
        newFilter = (r: ScopedReport) => (+g(r)) <= (value);
        break;
      case 'gt':
        newFilter = (r: ScopedReport) => (+g(r)) > (value);
        break;
      case 'gte':
        newFilter = (r: ScopedReport) => (+g(r)) >= (value);
        break;
      default:
        newFilter = nothing;
        break;
    }
    filters.push(newFilter);
    return filters;
  }, [] as Array<(r: ScopedReport) => boolean>);
}

// eslint-disable-next-line max-len
function buildReportsFilters(this: Pagination['filters']): false|Array<(r: Report) => boolean> {
  const userFieldFilters = (buildReportsFiltersScopedString as BuildReportsFiltersScopedString<Report['user'], 'nick', string>).call(
    this as Record<'user.nick', FilterRecordPair<string>>,
    'user.',
    ['nick'],
  );
  const dFieldFilters = (buildReportsFiltersScopedString as BuildReportsFiltersScopedString<Report['d'], 'title' | 'substances', string>).call(
    this as Record<'d.title'|'d.substances.*.namePsychonautWikiOrg', FilterRecordPair<string>>,
    'd.',
    ['title', 'substances.*.namePsychonautWikiOrg' as any],
  ).concat(
    (buildReportsFiltersScopedNumeric as BuildReportsFiltersScopedString<Report['d'], 'dateTimestamp', number>).call(
      this as Record<'d.dateTimestamp', FilterRecordPair<number>>,
      'd.',
      ['dateTimestamp'],
    ),
  );
  const fieldFilters = ([] as Array<(r: Report) => boolean>)
    .concat(userFieldFilters.map((cb) => (r: Report) => cb(r.user)))
    .concat(dFieldFilters.map((cb) => (r: Report) => cb(r.d)));

  if (!fieldFilters.length) {
    return false;
  }
  return fieldFilters.includes(nothing) ? [] : fieldFilters;
}

const applyFilterSortToReports = (
  pagination: Pick<Pagination, 'order' | 'filters'>,
  reports: Reports,
  desired: Omit<Pagination, 'viewIds'|'ids'>,
): Array<string> => {
  const ids = Object.keys(reports);
  const filters = buildReportsFilters.call(desired.filters);
  const filtered = filters
    ? ids
      .map((id) => reports[id])
      .filter((report) => filters.every((f) => f(report)))
      .map((report) => report.id)
    : ids;
  return filtered.sort((a, b) => a.localeCompare(b) * pagination.order.id);
};

const calcLocalIndex = ({ pagination, desired, localReportIds }: {
  pagination: Pagination;
  desired: Pick<Pagination, 'page'|'pageSize'>;
  localReportIds: string[];
}) => {
  const remoteIndex = pagination.page * pagination.pageSize;
  const localIndex = localReportIds.indexOf(pagination.ids[0]);
  const remoteIndexDesired = desired.page * desired.pageSize;
  const remoteIndexShift = remoteIndexDesired - remoteIndex;
  const localIndexShift = remoteIndexShift; // guess. we made assumption
  const localIndexDesired = localIndex + localIndexShift;
  return localIndexDesired;
};

let fetchReportsConsistentlyPromiseCallCount = 0;

export default {
  async [FETCH_REPORTS](
    { commit, state }: ActionContext<State, unknown>,
    desired: Omit<Pagination, 'viewIds'|'ids'>,
  ) {
    commit(SET_LOADING, true);
    const pagination = state[PAGINATION];
    const localReportIds = applyFilterSortToReports(pagination, state[REPORTS], desired);
    let localIndexDesired = calcLocalIndex({
      pagination,
      desired,
      localReportIds,
    });
    let desiredPageSize = desired.pageSize;
    if (desired.page === undefined || desired.pageSize === undefined) {
      localIndexDesired = 0;
      desiredPageSize = pagination.pageSize;
    }
    commit(SET_PAGINATION, {
      ...pagination,
      viewIds: localReportIds.slice(localIndexDesired, localIndexDesired + desiredPageSize),
    });

    fetchReportsConsistentlyPromiseCallCount += 1;
    const dataPromiseCallCount = fetchReportsConsistentlyPromiseCallCount;
    try {
      const data = await api.fetchReports(desired);
      commit(ADD_DATA, data.items);
      if (dataPromiseCallCount !== fetchReportsConsistentlyPromiseCallCount) {
        return;
      }

      const ids = data.items.map((r) => r.id);
      commit(SET_PAGINATION, {
        ...pagination,
        ...desired,
        page: data.page,
        pageSize: data.pageSize,
        itemsTotal: data.itemsTotal,
        // sort: '',
        ids,
        viewIds: ids,
      });
    } finally {
      if (dataPromiseCallCount === fetchReportsConsistentlyPromiseCallCount) {
        commit(SET_LOADING, false);
      }
    }
  },

};
