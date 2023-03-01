<template>
  <div class="home">
    <img alt="logo" src="../assets/logo.svg">
    <SubmitReport />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubmitReport from '../components/SubmitReport.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Submit',
  components: {
    SubmitReport,
  },
});
</script>
