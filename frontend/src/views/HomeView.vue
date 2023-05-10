<template>
  <div class="center">
    <img alt="logo" src="../assets/logo.svg">
    <p>{{ $t('home_view.ero-description') }}</p>
    <router-link to ="/reports">{{ $t('home_view.router-link-text') }}</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { i18n, loadLocaleMessages } from '../main';

export default defineComponent({
  name: 'HomeView',
  async beforeMount() {
    // Check if the desired locale messages are available
    if (!i18n.global.availableLocales.includes(i18n.global.locale)) {
      // Load the locale messages on demand
      await loadLocaleMessages(i18n.global.locale);
    }
  },
});
</script>
