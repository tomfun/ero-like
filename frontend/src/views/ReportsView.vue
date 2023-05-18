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
import LocaleChanger from '../components/LocaleChanger.vue';

export default defineComponent({
  name: 'ReportsView',
  components: {
    ReportsTable,
    LocaleChanger
  },
});
</script>
