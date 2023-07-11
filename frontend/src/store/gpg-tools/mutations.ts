import type { Software, GpgToolsModuleState } from './gpgToolsModuleState'
import { SOFTWARE } from './gpgToolsModuleState'

export const SET_SOFTWARE = 'set_pagination' as const

export default {
  [SET_SOFTWARE](state: GpgToolsModuleState, software: Software) {
    state[SOFTWARE] = software
  },
}
