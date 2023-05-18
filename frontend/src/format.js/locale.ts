import type { FluentVariable } from '@fluent/bundle/esm/bundle';
import { negotiateLanguages } from "@fluent/langneg";
import type { FluentBundle } from "@fluent/bundle";
import { mapBundleSync } from "@fluent/sequence";

export interface FormatJsOptions { defaultLocale: string, availableLocales: string[], load: (locale: string) => Promise<FluentBundle> }

export class Locale {
  public locale: string;
  public readonly bundles = new Map() as Map<string, FluentBundle>;
  private readonly loadMap = new Map() as Map<string, Promise<void>>;
  constructor(private readonly options: FormatJsOptions) {
    this.locale = negotiateLanguages(
      navigator.languages, // requested locales
      options.availableLocales, // available locales
      { defaultLocale: options.defaultLocale, strategy: "lookup", }
    )[0]
    this._load(this.locale)
  }
  private async _load(locale: string) {
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
    const ctx = mapBundleSync(this.bundles.values(), id);

    if (ctx === null) {
      return id;
    }

    const msg = ctx.getMessage(id);
    return msg?.value ? ctx.formatPattern(msg?.value, args) : id;
  }
}
