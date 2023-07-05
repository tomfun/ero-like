<template>
  <div>
    <UserRegistration />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import UserRegistration from '../components/UserRegistration.vue'
import { useLocale } from '../format.js/provider'

export default defineComponent({
  name: 'UserView',
  components: {
    UserRegistration,
  },
  setup() {
    useMeta({
      title: useLocale().formatString('user_registration'),
    })
  },
})
</script>
