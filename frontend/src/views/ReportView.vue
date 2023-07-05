<template>
  <h1>Report</h1>
  <ReportPage />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReportPage from '../components/ReportPage.vue'

export default defineComponent({
  name: 'ReportsView',
  components: {
    ReportPage,
  },
})
</script>
