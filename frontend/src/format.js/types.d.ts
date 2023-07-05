declare namespace FormatJs {
  type Path = string
  type Locale = string
  type FallbackLocale = string | string[] | false | { [locale: string]: string[] }
  type Values = any[] | { [key: string]: any }
  type Choice = number
  type MessageFunction = (ctx: MessageContext) => string
  type LocaleMessage = string | MessageFunction | LocaleMessageObject | LocaleMessageArray
  interface LocaleMessageObject {
    [key: string]: LocaleMessage
  }
  interface LocaleMessageArray {
    [index: number]: LocaleMessage
  }
  interface LocaleMessages {
    [key: string]: LocaleMessageObject
  }
  type TranslateResult = string | LocaleMessages

  type LocaleMatcher = 'lookup' | 'best fit'
  type FormatMatcher = 'basic' | 'best fit'

  type DateTimeHumanReadable = 'long' | 'short' | 'narrow'
  type DateTimeDigital = 'numeric' | '2-digit'

  interface SpecificDateTimeFormatOptions extends Intl.DateTimeFormatOptions {
    year?: DateTimeDigital
    month?: DateTimeDigital | DateTimeHumanReadable
    day?: DateTimeDigital
    hour?: DateTimeDigital
    minute?: DateTimeDigital
    second?: DateTimeDigital
    weekday?: DateTimeHumanReadable
    era?: DateTimeHumanReadable
    timeZoneName?: 'long' | 'short'
    localeMatcher?: LocaleMatcher
    formatMatcher?: FormatMatcher
  }

  type DateTimeFormatOptions = Intl.DateTimeFormatOptions | SpecificDateTimeFormatOptions

  interface DateTimeFormat {
    [key: string]: DateTimeFormatOptions
  }
  interface DateTimeFormats {
    [locale: string]: DateTimeFormat
  }
  type DateTimeFormatResult = string

  type CurrencyDisplay = 'symbol' | 'code' | 'name'

  interface SpecificNumberFormatOptions extends Intl.NumberFormatOptions {
    style?: 'decimal' | 'percent'
    currency?: string
    currencyDisplay?: CurrencyDisplay
    localeMatcher?: LocaleMatcher
    formatMatcher?: FormatMatcher
  }

  interface CurrencyNumberFormatOptions extends Intl.NumberFormatOptions {
    style: 'currency'
    currency: string // Obligatory if style is 'currency'
    currencyDisplay?: CurrencyDisplay
    localeMatcher?: LocaleMatcher
    formatMatcher?: FormatMatcher
  }

  type NumberFormatOptions =
    | Intl.NumberFormatOptions
    | SpecificNumberFormatOptions
    | CurrencyNumberFormatOptions

  interface NumberFormat {
    [key: string]: NumberFormatOptions
  }
  interface NumberFormats {
    [locale: string]: NumberFormat
  }
  type NumberFormatResult = string
  type PluralizationRulesMap = {
    /**
     * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
     * @param choicesLength {number} an overall amount of available choices
     * @returns a final choice index
     */
    [lang: string]: (choice: number, choicesLength: number) => number
  }
  type Modifiers = { [key: string]: (str: string) => string }

  type FormattedNumberPartType =
    | 'currency'
    | 'decimal'
    | 'fraction'
    | 'group'
    | 'infinity'
    | 'integer'
    | 'literal'
    | 'minusSign'
    | 'nan'
    | 'plusSign'
    | 'percentSign'

  type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error'

  interface FormattedNumberPart {
    type: FormattedNumberPartType
    value: string
  }
  interface NumberFormatToPartsResult {
    [index: number]: FormattedNumberPart
  }
}

// it may be useful in the future for extending the module
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface IFormatJs {
  // t(key: FormatJs.Path, values?: FormatJs.Values): FormatJs.TranslateResult;
  // t(key: FormatJs.Path, locale: FormatJs.Locale, values?: FormatJs.Values): FormatJs.TranslateResult;
  // tc(key: FormatJs.Path, choice?: FormatJs.Choice, values?: FormatJs.Values): string;
  // tc(
  //   key: FormatJs.Path,
  //   choice: FormatJs.Choice,
  //   locale: FormatJs.Locale,
  //   values?: FormatJs.Values,
  // ): string;
  // te(key: FormatJs.Path, locale?: FormatJs.Locale): boolean;
  // n(value: number, key?: FormatJs.Path, locale?: FormatJs.Locale): FormatJs.NumberFormatResult;
  // n(value: number, args?: { [key: string]: string }): FormatJs.NumberFormatResult;
  // n(value: number, options?: FormatJs.NumberFormatOptions, locale?: FormatJs.Locale): FormatJs.NumberFormatResult;
  // getLocaleMessage(locale: FormatJs.Locale): FormatJs.LocaleMessageObject;
  // setLocaleMessage(locale: FormatJs.Locale, message: FormatJs.LocaleMessageObject): void;
  // mergeLocaleMessage(locale: FormatJs.Locale, message: FormatJs.LocaleMessageObject): void;
  // getDateTimeFormat(locale: FormatJs.Locale): FormatJs.DateTimeFormat;
  // setDateTimeFormat(locale: FormatJs.Locale, format: FormatJs.DateTimeFormat): void;
  // mergeDateTimeFormat(locale: FormatJs.Locale, format: FormatJs.DateTimeFormat): void;
  // getNumberFormat(locale: FormatJs.Locale): FormatJs.NumberFormat;
  // setNumberFormat(locale: FormatJs.Locale, format: FormatJs.NumberFormat): void;
  // mergeNumberFormat(locale: FormatJs.Locale, format: FormatJs.NumberFormat): void;
  // getChoiceIndex: (choice: number, choicesLength: number) => number;
}
