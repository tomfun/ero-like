import type { Locale } from './locale';
import { computed } from 'vue';
import { useLocale } from './provider';

function dateFormatShort($locale: Locale): string {
  const locale = $locale.locale;
  const options = { day: '2-digit' as const, month: '2-digit' as const, year: '2-digit' as const };

  const sampleDate = new Date(2000, 3, 1); // Note: JavaScript counts months from 0
  const dateParts = new Intl.DateTimeFormat(locale, options).formatToParts(sampleDate);

  let format = '';
  for (const part of dateParts) {
    if (part.type === 'day') {
      format += 'dd';
    } else if (part.type === 'month') {
      format += 'mm';
    } else if (part.type === 'year') {
      format += 'yy';
    } else if (part.type === 'literal') {
      format += part.value;
    }
  }

  return format;
}

export function useFormat() {
  const locale = useLocale();
  return {
    dateFormatShort: computed(() => dateFormatShort(locale))
  };
}
