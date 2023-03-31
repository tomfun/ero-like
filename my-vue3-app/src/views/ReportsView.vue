<template>
  <div>
    <h1>This is report storage</h1>
    <ReportsTable/>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReportsTable from '../components/ReportsTable.vue';

export default defineComponent({
  name: 'ReportsView',
  components: {
    ReportsTable,
  },
});
</script>
