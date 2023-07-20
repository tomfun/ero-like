export const SOFTWARE = 'software' as const
export const PUBLIC_KEY_ARMORED = 'publicKeyArmored' as const
export const PRIVATE_KEY_ARMORED = 'privateKeyArmored' as const
export const PASSPHRASE = 'passphrase' as const
export enum Software {
  Linux = 'Linux',
  Inner = 'Inner',
}

export const ALL_SOFTWARE = [Software.Linux, Software.Inner]

export const ALL_SOFTWARE_REV = ALL_SOFTWARE.reduce(
  (o, v, i) => ((o[v] = i), o),
  {} as Record<Software, number>,
)

export interface GpgToolsModuleState {
  [SOFTWARE]: Software
  [PUBLIC_KEY_ARMORED]: string | null
  [PRIVATE_KEY_ARMORED]: string | null
  revocationCertificate: string | null
  [PASSPHRASE]: string
}

export const NAMESPACE_PREFIX_LOCAL_STORAGE = 'gpg-tools'
let softwareRaw: string | null = null
try {
  softwareRaw = localStorage.getItem(
    [NAMESPACE_PREFIX_LOCAL_STORAGE, 'Software'].join('.'),
  )
} catch (e) {
  // ignore
}
const software: Software =
  softwareRaw && ALL_SOFTWARE.includes(softwareRaw as Software)
    ? (softwareRaw as Software)
    : Software.Linux

const state: GpgToolsModuleState = {
  [SOFTWARE]: software,
  [PUBLIC_KEY_ARMORED]: null,
  [PRIVATE_KEY_ARMORED]: null,
  revocationCertificate: null,
  [PASSPHRASE]: '',
}

export default state
