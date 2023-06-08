<template>
  <div class="center">
    <img alt="logo" src="../assets/logo.svg">
    <h1>{{ $t('app_about') }}</h1>
    <div v-html="$t('ero-like-about')"/>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'vue-meta'
import { useLocale } from '../format.js/provider'

export default defineComponent({
  name: 'AboutView',
  setup () {
    useMeta({
      title: useLocale().formatString('about_page_title'),
      description: useLocale().formatString('about_page_description'),
      keywords: useLocale().formatString('about_page_keywords'),
    })
  }
});
</script>
<style scoped lang="scss">
.about {
  p {
    text-align: left;
  }
  q {
    display: block;
    padding: 2px;
    text-align: right;
    color: #42098380;
  }
}
</style>

