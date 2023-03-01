<template>
  <div class="home">
    <img alt="logo" src="../assets/logo.svg">
    <p>The ero-like website is actually a platform for creating and sharing reports, similar to
      tweets, but with the use of digital signatures and structured data. Our platform allows users
      to easily create reports and share them with others, while ensuring the authenticity and
      integrity of the data through the use of digital signatures and open standards. As an open
      source project, we encourage the downloading and sharing of information from our site.</p>
    <router-link to ="/reports">Look for interesting...</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
});
</script>
