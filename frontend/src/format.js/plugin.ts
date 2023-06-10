import type { FluentVariable } from '@fluent/bundle/esm/bundle';
import 'intl-pluralrules'
import type Vue from 'vue'
import { formatJsKey } from './injection-key'
import { Locale } from './locale';
import type { FormatJsOptions } from './locale';
import type { FormatJs } from './types';

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (messageId: string, variables?: Record<string, FluentVariable>|null) => string;
    $d: (date: number | Date, args?: Record<string, string> | FormatJs.DateTimeFormatOptions) => FormatJs.DateTimeFormatResult;
    $dx: (dateInSeconds: number, args?: Record<string, string> | FormatJs.DateTimeFormatOptions) => FormatJs.DateTimeFormatResult;
    $locale: Locale;
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
    app.config.globalProperties.$d = $locale.formatDate.bind($locale)
    app.config.globalProperties.$dx = (d: number, args?: Record<string, string> | FormatJs.DateTimeFormatOptions) => app.config.globalProperties.$d(d * 1000, args)

    app.provide(formatJsKey, $locale)
  },
})
