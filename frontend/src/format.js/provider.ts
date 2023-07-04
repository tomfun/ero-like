import { inject, provide } from 'vue'
import { formatJsKey } from './injection-key'
import type { Locale } from './locale'

export function provideLocale(intl: Locale) {
  provide(formatJsKey, intl)
}

export function useLocale() {
  const intl = inject<Locale>(formatJsKey)
  if (!intl) {
    throw new Error(
      `An $locale object was not injected. Install the plugin or use provideIntl.`,
    )
  }
  return intl
}
