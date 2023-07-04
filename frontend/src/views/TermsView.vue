<template>
  <div class="center">
    <img alt="logo" src="../assets/logo.svg" />
  </div>
  <h1>{{ $t('app_terms_of_use') }}</h1>
  <div v-html="$t('ero-like-terms-agreement')" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useLocale } from '../format.js/provider'

export default defineComponent({
  name: 'TermsView',
  setup() {
    useMeta({
      title: useLocale().formatString('app_terms_of_use'),
    })
  },
})
</script>
