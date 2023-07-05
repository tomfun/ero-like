<template>
  <div>
    <h1>{{ $t('reports_title') }}</h1>
    <ReportsTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import ReportsTable from '../components/ReportsTable.vue'
import { useLocale } from '../format.js/provider'

export default defineComponent({
  name: 'ReportsView',
  components: {
    ReportsTable,
  },
  setup() {
    useMeta({
      title: useLocale().formatString('reports_page_title'),
      description: useLocale().formatString('reports_page_description'),
      keywords: useLocale().formatString('reports_page_keywords'),
    })
  },
})
</script>
