<template>
  <Dropdown
    v-model="localLocale"
    optionLabel="nativeName"
    :options="suggestions"
    :placeholder="$locale.locale"
    :loading="isLoading"
    aria-label="Locale Language"
    @change="onChange"
  >
    <template #option="slotProps">
      <div class="flex align-options-center">
        <span :class="`fi fi-${mapFlag(slotProps.option.code)}`"></span>&nbsp;
        <span>{{ slotProps.option.name }}</span
        >&nbsp;
        <i>{{ slotProps.option.nativeName }}</i>
      </div>
    </template>
  </Dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { LanguageCode } from 'iso-639-1'
import ISO6391 from 'iso-639-1'

const locale2charToFlagMap = {
  en: 'us', // English
  uk: 'ua', // Ukrainian
  he: 'il', // Hebrew
  pt: 'br', // Portuguese
  ja: 'jp', // Japanese
  zh: 'cn', // Chinese (Simplified)
  hi: 'in', // Hindi
  ar: 'sa', // Arabic
  bn: 'bd', // Bengali
}

export default defineComponent({
  name: 'LocaleSelect',
  data() {
    return {
      localLocale: {},
      isLoading: false,
      suggestions: [] as Array<{
        code: LanguageCode
        name: string
        nativeName: string
      }>,
    }
  },
  watch: {
    '$locale.locale'() {
      this.modelToView()
    },
  },
  mounted() {
    this.onAutoCompleteSearch({ query: '' })
    this.modelToView()
  },
  methods: {
    modelToView() {
      this.localLocale = ISO6391.getLanguages([
        this.$locale.locale.toLowerCase().slice(0, 2),
      ])[0]
    },
    mapFlag(locale: string) {
      const small = locale.toLowerCase().slice(0, 2)
      return (locale2charToFlagMap as Record<string, string>)[small] || small
    },
    onAutoCompleteSearch({ query }: { query: string }) {
      const languages = ISO6391.getLanguages(
        this.$locale.options.availableLocales.map((c) => c.slice(0, 2)),
      )
      if (!query.trim().length) {
        ISO6391.getAllCodes
        this.suggestions = languages
      } else {
        this.suggestions = languages.filter((country) => {
          const q = query.toLowerCase()
          return (
            country.name.toLowerCase().startsWith(q) ||
            country.code.toLowerCase().startsWith(q) ||
            country.nativeName.toLowerCase().startsWith(q)
          )
        })
      }
    },
    async onChange({
      value: { code: locale },
    }: {
      value: {
        code: LanguageCode
        name: string
        nativeName: string
      }
    }) {
      await this.load(locale)
      this.redirect(locale)
    },
    async load(locale: string) {
      try {
        this.isLoading = true
        await this.$locale.loadTranslations(locale)
      } catch (e) {
        this.modelToView()
        throw e
      } finally {
        this.isLoading = false
      }
    },
    redirect(locale: string) {
      this.$router.push({
        ...this.$router.currentRoute.value,
        params: {
          ...this.$router.currentRoute.value.params,
          locale,
        },
      })
    },
  },
})
</script>
