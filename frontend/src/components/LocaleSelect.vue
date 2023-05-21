<template>
  <select :value="locale" @change="handleLanguageSelect">
    <option v-for="(lang, i) in $locale.options.availableLocales" :key="`${i}`"
            :value="lang">
      {{ lang }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LocaleSelect',
  data() {
    return { localLocale: '' }
  },
  computed: {
    locale() {
      return this.localLocale || this.$locale.locale
    }
  },
  methods: {
    async handleLanguageSelect(event: Event) {
      const locale = (event.target as HTMLSelectElement).value;
      await this.load(locale);
      this.redirect(locale);
    },
    async load(locale: string) {
      this.localLocale = locale;
      try {
        await this.$locale.loadTranslations(locale)
      } finally {
        this.localLocale = ''
      }
    },
    redirect(locale: string) {
      this.$router.push({
        ...this.$router.currentRoute.value,
        params: {
          ...this.$router.currentRoute.value.params,
          locale,
        }
      });
    }
  }
});
</script>
