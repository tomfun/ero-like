import type { ShallowRef } from 'vue';
import { shallowRef } from 'vue';
import type { FluentVariable } from '@fluent/bundle/esm/bundle';
import { negotiateLanguages } from "@fluent/langneg";
import type { FluentBundle } from "@fluent/bundle";
import type { FormatJs } from './types';

export interface FormatJsOptions { defaultLocale: string, isShowNotFoundTranslationsWarning?: boolean, availableLocales: string[], load: (locale: string) => Promise<FluentBundle> }

export class Locale {
  public localeRef: ShallowRef<string>;
  public readonly bundles = new Map() as Map<string, FluentBundle>;
  private readonly loadMap = new Map() as Map<string, Promise<void>>;
  private readonly showedWarnings = new Set() as Set<string>;
  constructor(public readonly options: FormatJsOptions) {
    const locale = negotiateLanguages(
      navigator.languages, // requested locales
      options.availableLocales, // available locales
      { defaultLocale: options.defaultLocale, strategy: "lookup", }
    )[0]
    this.localeRef = shallowRef(locale);
    this.loadTranslations(this.locale)
  }
  get locale() {
    return this.localeRef.value
  }

  async loadTranslations(locale: string) {
    if (this.loadMap.has(locale)) {
      return this.loadMap.get(locale)
    }
    this.loadMap.set(locale, this.options.load(locale).then((bundle) => {
      this.bundles.set(locale, bundle)
      this.loadMap.delete(locale)
    }));
    return this.loadMap.get(locale)
  }

  get load() {
    if (this.loadMap.has(this.locale)) {
      return this.loadMap.get(this.locale)
    }
    return Promise.resolve();
  }

  formatString(id: string, args: Record<string, FluentVariable>|null = null) {
    const ctx = this.bundles.get(this.locale);
    if (!ctx) {
      this.warn(`locale ${this.locale} not found`)
      return id;
    }

    const msg = ctx.getMessage(id);
    if (!msg?.value) {
      this.warn(`locale ${this.locale} translation message ${id} not found`);
      return id;
    }
    return ctx.formatPattern(msg?.value, args);
  }

  formatDate(date: number | Date, args?: Record<string, string> | FormatJs.DateTimeFormatOptions): FormatJs.DateTimeFormatResult {
    const f = new Intl.DateTimeFormat(this.locale, args);
    return f.format(date);
  }

  private warn(message: string) {
    if (!this.options.isShowNotFoundTranslationsWarning) {
      return;
    }
    if (this.showedWarnings.has(message)) {
      return;
    }
    console.warn(message);
    this.showedWarnings.add(message)
  }
}
