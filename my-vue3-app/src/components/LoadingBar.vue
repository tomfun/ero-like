<template>
  <div>
    <h2>bars</h2>
    <vue-loading
      type="bars"
      color="#d9544e"
      :size="{ width: '50px', height: '50px' }" >
    </vue-loading>
  </div>
</template>

<script lang="ts">
import { VueLoading } from 'vue-loading-template';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingBar',
  components: {
    VueLoading,
  },
});
</script>
