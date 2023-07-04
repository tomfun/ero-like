import state from './state'
import actions from './actions'
import mutations from './mutations'

export const REPORTS_MODULE = 'reports'

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}

export * from './state'
