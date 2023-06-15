<template>
  <metainfo>
    <!--suppress VueUnrecognizedSlot -->
    <template v-slot:title="{ content = '' }">
      {{ content ? `${content} | Ero Like` : `Ero Like` }}
    </template>
  </metainfo>
  <LocaleContainer />
</template>
<script setup lang="ts">
import LocaleContainer from './LocaleContainer.vue';
</script>
