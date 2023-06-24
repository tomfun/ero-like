<template>
  <Message severity="info">If this is the substance you took in the very begining, then choose zero.</Message>
  <Message severity="info"> Both of the timelines(substance input, reporting) starts with the first substance input. </Message>

  <SubstanceItem
    v-for="(s, i) in value"
    :key="i"
    v-model="value[i]"
    :rm="rmFor(i)"
  />
  <div class="w-full">
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

<script setup lang="ts" generic="T extends Substance">
import type { Substance } from '../services/api';
import { computed } from 'vue';
import SubstanceItem from './SubstanceItem.vue';

const props = defineProps({
  modelValue: {
    default() {
      return [] as T[];
    },
  },
  empty: {
    default() {
      return {
        timeSecond: 0,
        namePsychonautWikiOrg: '',
        dose: 1,
      } as T;
    },
  }
})
const emits = defineEmits<{
  'update:modelValue': [array: T[]],
}>()

const value = computed({
  get(): T[] {
    return props.modelValue;
  },
  set(value: T[]) {
    emits('update:modelValue', value);
  }
})

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
