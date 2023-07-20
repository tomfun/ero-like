import type { ActionContext } from 'vuex'
import { sign } from '../../services/openpgp'
import type { GpgToolsModuleState } from './gpgToolsModuleState'
import {
  SET_PASSPHRASE,
  SET_PRIVATE_KEY_ARMORED,
  SET_PUBLIC_KEY_ARMORED,
} from './mutations'

export const SET_ALL = 'set_key_data' as const

export type AllData = {
  passphrase: string
  publicKeyArmored: string
  privateKeyArmored: string
  revocationCertificate: string
}

export default {
  async [SET_ALL](
    { commit }: ActionContext<GpgToolsModuleState, unknown>,
    data: Partial<AllData>,
  ) {
    const valid = data as AllData
    await sign(valid, 'Hello, World!')

    commit(SET_PUBLIC_KEY_ARMORED, valid.publicKeyArmored)
    commit(SET_PRIVATE_KEY_ARMORED, valid.privateKeyArmored)
    commit('set_revocationCertificate', valid.revocationCertificate)
    commit(SET_PASSPHRASE, valid.passphrase)
  },
}
