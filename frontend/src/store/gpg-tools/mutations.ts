import type { Software, GpgToolsModuleState } from './gpgToolsModuleState'
import {
  SOFTWARE,
  PASSPHRASE,
  PRIVATE_KEY_ARMORED,
  PUBLIC_KEY_ARMORED,
} from './gpgToolsModuleState'

export const SET_SOFTWARE = 'set_pagination' as const
export const SET_PASSPHRASE = 'set_passphrase' as const
export const SET_PRIVATE_KEY_ARMORED = 'set_privateKeyArmored' as const
export const SET_PUBLIC_KEY_ARMORED = 'set_publicKeyArmored' as const

export default {
  [SET_PASSPHRASE](state: GpgToolsModuleState, passphrase: string) {
    state[PASSPHRASE] = passphrase
  },
  [SET_PRIVATE_KEY_ARMORED](state: GpgToolsModuleState, key: string) {
    state[PRIVATE_KEY_ARMORED] = key
  },
  [SET_PUBLIC_KEY_ARMORED](state: GpgToolsModuleState, key: string) {
    state[PUBLIC_KEY_ARMORED] = key
  },
  set_revocationCertificate(state: GpgToolsModuleState, key: string) {
    state.revocationCertificate = key
  },
  [SET_SOFTWARE](state: GpgToolsModuleState, software: Software) {
    state[SOFTWARE] = software
  },
}
