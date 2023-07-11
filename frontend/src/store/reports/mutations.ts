import type {
  IsLoading,
  Pagination,
  Report,
  ReportsModuleState,
} from './reportsModuleState'
import { REPORTS } from './reportsModuleState'

export const SET_PAGINATION = 'set_pagination'
export const ADD_DATA = 'add_data'
export const SET_LOADING = 'set_loading'

export default {
  [SET_PAGINATION](state: ReportsModuleState, pagination: Pagination) {
    state.pagination = pagination
    state.pagination.filters['signature.user.nick'] =
      pagination.filters['signature.user.nick']
    state.pagination.filters['d.title'] = pagination.filters['d.title']
    state.pagination.encodedQuery = pagination.encodedQuery
  },

  [ADD_DATA](state: ReportsModuleState, data: Array<Report>) {
    data.forEach((report) => {
      state[REPORTS][report.id] = report
    })
  },

  [SET_LOADING](state: ReportsModuleState, isLoading: IsLoading) {
    state.isLoading = isLoading
  },
}
