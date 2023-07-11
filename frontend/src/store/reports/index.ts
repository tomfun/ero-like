import state from './reportsModuleState'
import actions from './actions'
import mutations from './mutations'

export const REPORTS_MODULE = 'reports'

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}

export * from './reportsModuleState'
