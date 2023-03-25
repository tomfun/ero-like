<template>
  <AutoComplete
    placeholder="filter by"
    :modelValue="modelValue"
    :suggestions="suggestions"
    @update:modelValue="$emit('update:modelValue', $event)"
    @complete="$emit('complete', $event)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EqualFilterWidget',
  props: {
    suggestions: Array,
    modelValue: String,
  },
  emits: ['update:modelValue', 'complete'],
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
