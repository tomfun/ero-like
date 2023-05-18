<template>
  <locale-changer></locale-changer>
  <div class="center">
    <img alt="logo" src="../assets/logo.svg">
    <p>{{ $t('home_view.ero-description') }}</p>
    <router-link to ="/reports">{{ $t('home_view.router-link-text') }}</router-link>
    {{ $t('welcome-message', {name: 'Вася'}) }}
    {{ $t('shared-photos', {userName: 'Вася', photoCount: 2, userGender: 'male'}) }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LocaleChanger from '../components/LocaleChanger.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    LocaleChanger,
  },
});
</script>
