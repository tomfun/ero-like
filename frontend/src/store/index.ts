import Vuex from 'vuex'

import reports, { REPORTS_MODULE } from './reports'
import type { ReportsModuleState } from './reports'
import gpgTools, { GPG_TOOLS_MODULE } from './gpg-tools'
import type { GpgToolsModuleState } from './gpg-tools'

export interface State {
  [REPORTS_MODULE]: ReportsModuleState
  [GPG_TOOLS_MODULE]: GpgToolsModuleState
}

export default new Vuex.Store<State>({
  strict: import.meta.env.DEV,
  modules: {
    [REPORTS_MODULE]: reports,
    [GPG_TOOLS_MODULE]: gpgTools,
  },
})
