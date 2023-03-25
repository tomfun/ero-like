<template>
  <div>
    <h1>This is report storage</h1>
    <ReportList/>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReportList from '../components/ReportList.vue';

export default defineComponent({
  name: 'Reports',
  components: {
    ReportList,
  },
});
</script>
