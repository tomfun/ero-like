<template>
  <div class="center">
    <img alt="logo" src="../assets/logo.svg">
    <h1>{{ $t('app_about') }}</h1>
    <div v-html="$t('ero-like-about')"/>
  </div>
</template>
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
<script setup>
</script>
