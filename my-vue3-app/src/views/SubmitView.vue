<template>
  <div>
    <SubmitReport />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubmitReport from '../components/SubmitReport.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'SubmitView',
  components: {
    SubmitReport,
  },
});
</script>
