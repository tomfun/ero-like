<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <SubmitReport msg="Welcome to Your Vue.js + TypeScript App"/>
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
