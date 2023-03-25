<template>
  <InputText
    placeholder="filter by"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EqualFilterWidget',
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
