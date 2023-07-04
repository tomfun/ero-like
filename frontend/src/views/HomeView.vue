<template>
  <div class="center">
    <img alt="logo" src="../assets/logo.svg" />
    <p>{{ $t('home-view-ero-description') }}</p>
    <router-link to="/reports">{{ $t('home-view-router-link-text') }}</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useLocale } from '../format.js/provider'

export default defineComponent({
  name: 'HomeView',
  setup() {
    useMeta({
      title: useLocale().formatString('home_page_title'),
      description: useLocale().formatString('home_page_description'),
      keywords: useLocale().formatString('home_page_keywords'),
    })
  },
})
</script>
