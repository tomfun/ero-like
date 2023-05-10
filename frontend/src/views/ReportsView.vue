<template>
  <LocaleChanger />
  <div>
    <h1>{{ $t('report_view.title') }}</h1>
    <ReportsTable/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReportsTable from '../components/ReportsTable.vue';
import { i18n, loadLocaleMessages } from '../main';
import LocaleChanger from '../components/LocaleChanger.vue';

export default defineComponent({
  name: 'ReportsView',
  components: {
    ReportsTable,
    LocaleChanger
  },
  async beforeMount() {
    // Check if the desired locale messages are available
    if (!i18n.global.availableLocales.includes(i18n.global.locale)) {
      // Load the locale messages on demand
      await loadLocaleMessages(i18n.global.locale);
    }
  },
});
</script>
