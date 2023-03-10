<template>
  <div>
    <UserRegistration />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserRegistration from '../components/UserRegistration.vue';

export default defineComponent({
  name: 'User',
  components: {
    UserRegistration,
  },
});
</script>
