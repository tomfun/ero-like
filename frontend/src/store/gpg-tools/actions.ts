import type { ActionContext } from 'vuex'
import type { GpgToolsModuleState } from './gpgToolsModuleState'
import { Software } from './gpgToolsModuleState'
import { SET_SOFTWARE } from './mutations'

export { SET_SOFTWARE } from './mutations'

export default {
  [SET_SOFTWARE](
    { commit }: ActionContext<GpgToolsModuleState, unknown>,
    software: Software,
  ) {
    // todo:remove the action. it is redundant
    commit(SET_SOFTWARE, software)
  },
}
