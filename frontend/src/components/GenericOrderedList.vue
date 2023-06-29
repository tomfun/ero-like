<template>
  <component
    :is="props.DynamicComponent"
    v-for="(s, i) in props.modelValue"
    :key="key(props.modelValue[i])"
    :modelValue="props.modelValue[i]"
    @update:modelValue="onChange($event, i)"
    :rm="rmFor(i)"
    :isFirst="i === 0"
    timeFormat="short"
  />
  <div class="w-full" style="padding-top: 0.5em">
    <div class="card flex justify-content-center flex-wrap gap-3">
      <Button
        severity="info"
        v-on:click="addElement">
        <span class="pi pi-plus"></span>
        &nbsp;
        {{ $t('Add') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { timeSecond: number; }, C extends Component">
import type { Component, PropType } from 'vue';

const props = defineProps({
  modelValue: {
    required: false,
    default() {
      return [] as T[];
    },
  },
  DynamicComponent: {
    required: true,
    type: Object as PropType<C>
  },
  empty: {
    required: false,
    default() {
      return {
        timeSecond: 0,
      } as T;
    },
  }
}) as unknown as { modelValue: T[], empty: T, DynamicComponent: C };

const emits = defineEmits({
  'update:modelValue'(array: T[]) {
    return Array
      .isArray(array) && array.every((s: T) => typeof s.timeSecond === 'number')
  }
})

const vueKeys = new WeakMap<T, number>();
let newKey = 0;
function key(value: T) {
  if (!vueKeys.has(value)) {
    vueKeys.set(value, ++newKey);
  }
  return vueKeys.get(value)
}

function onChange(el: T, i: number) {
  let newArray: T[] = props.modelValue;
  newArray.splice(i, 1, el);
  newArray.sort((a, b) => (a.timeSecond || 0) - (b.timeSecond || 0));
  emits('update:modelValue', newArray);
}

function addElement() {
  emits('update:modelValue', [...props.modelValue, props.empty]);
}

function rmElement(i: number) {
  const newArray = (props.modelValue || []).slice(0);
  newArray.splice(i, 1);
  emits('update:modelValue', newArray);
}

const rms = [] as Array<() => void>
function rmFor(i: number) {
  if (!rms[i]) {
    rms[i] = rmElement.bind(rmElement, i);
  }
  return rms[i];
}
</script>

<style scoped lang="scss">

</style>
