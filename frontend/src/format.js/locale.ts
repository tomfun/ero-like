import type { ShallowRef } from 'vue';
import { shallowRef } from 'vue';
import type { FluentVariable } from '@fluent/bundle/esm/bundle';
import { negotiateLanguages } from "@fluent/langneg";
import type { FluentBundle } from "@fluent/bundle";

export interface FormatJsOptions { defaultLocale: string, availableLocales: string[], load: (locale: string) => Promise<FluentBundle> }

export class Locale {
  public localeRef: ShallowRef<string>;
  public readonly bundles = new Map() as Map<string, FluentBundle>;
  private readonly loadMap = new Map() as Map<string, Promise<void>>;
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
      return id;
    }

    const msg = ctx.getMessage(id);
    return msg?.value ? ctx.formatPattern(msg?.value, args) : id;
  }
}
