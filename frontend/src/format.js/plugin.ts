import type { FluentVariable } from '@fluent/bundle/esm/bundle';
import 'intl-pluralrules'
import type Vue from 'vue'
import { formatJsKey } from './injection-key'
import { Locale } from './locale';
import type { FormatJsOptions } from './locale';

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (messageId: string, variables: Record<string, FluentVariable>|null) => string;
    $locale: { locale: string; }
  }
}

export const createLocale = (options: FormatJsOptions): Vue.Plugin => ({
  install(app) {
    if (!options) {
      throw new Error('Missing `options` for format.js plugin')
    }
    const $locale = new Locale(options);
    options.load

    app.config.globalProperties.$locale = $locale
    app.config.globalProperties.$t = $locale.formatString.bind($locale)

    app.provide(formatJsKey, $locale)
  },
})
