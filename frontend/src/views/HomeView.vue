<template>
  <div class="center">
    <img alt="logo" src="../assets/logo.svg">
    <p>{{ $t('home-view-ero-description') }}</p>
    <router-link to ="/reports">{{ $t('home-view-router-link-text') }}</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
});
</script>
