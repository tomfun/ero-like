<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <SubmitReport msg="Добро пожаловать в архив трип-репортов"/>
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