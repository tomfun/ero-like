<template>
  <div>
    <SubmitReport />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubmitReport from '../components/SubmitReport.vue';

export default defineComponent({
  name: 'SubmitView',
  components: {
    SubmitReport,
  },
});
</script>
