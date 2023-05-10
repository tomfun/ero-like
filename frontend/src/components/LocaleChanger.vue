<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale" @change="handleLanguageSelect">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
        {{ lang }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { loadLocaleMessages } from '../main';

export default defineComponent({
  name: 'LocaleChanger',
  data () {
    return { langs: ['ru', 'en', 'he'] }
  },
  methods: {
    handleLanguageSelect(event: any) {    
      return loadLocaleMessages(event.target.value);
    }
  }
});
</script>
