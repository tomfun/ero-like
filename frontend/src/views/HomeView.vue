<template>
  <div class="center">
    <img alt="logo" src="../assets/logo.svg">
    <p>{{ $t('home-view-ero-description') }}</p>
<!--    <router-link to ="/reports">{{ $t('home_view.router-link-text') }}</router-link>-->
    {{ $t('welcome-message', {name: 'Вася'}) }}
    {{ $t('shared-photos', {userName: 'Вася', photoCount: 2, userGender: 'male'}) }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
});
</script>
