<template>
  <div class="locale-changer">
    <select @change="handleLanguageSelect">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
        {{ lang }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useLocale } from '../format.js/provider';

export default defineComponent({
  name: 'LocaleChanger',
  data () {
    return { langs: ['en', 'ru', 'he'] }
  },
  methods: {
    handleLanguageSelect(event: Event) {
      console.log('this.$locale', this.$locale, event);
      // return loadLocaleMessages((event.target as HTMLSelectElement).value);
    }
  }
});
</script>
