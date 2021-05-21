<template>
  <div class="about">
    <h1>This is report storage</h1>
    <ReportDB msg="Hello, Bratya po razumu!"/>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReportDB from '../components/ReportDB.vue';

export default defineComponent({
  name: 'Reports',
  components: {
    ReportDB,
  },
});
</script>
