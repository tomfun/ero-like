<template>
  <div>
    <SubmitReport />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'vue-meta';
import SubmitReport from '../components/SubmitReport.vue';
import { useLocale } from '../format.js/provider';

export default defineComponent({
  name: 'SubmitView',
  components: {
    SubmitReport,
  },
  setup () {
    useMeta({
      title: useLocale().formatString('submit_page_title'),
      description: useLocale().formatString('submit_page_description'),
      keywords: useLocale().formatString('submit_page_keywords'),
    })
  }
});
</script>
