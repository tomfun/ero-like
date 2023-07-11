export const SOFTWARE = 'software' as const
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
}

const NAMESPACE_PREFIX_LOCAL_STORAGE = 'gpg-tools'
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
}

export default state
