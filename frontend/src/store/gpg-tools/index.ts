import state from './gpgToolsModuleState'
import actions from './actions'
import mutations from './mutations'

export const GPG_TOOLS_MODULE = 'gpg-tools' as const

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}

export * from './gpgToolsModuleState'
