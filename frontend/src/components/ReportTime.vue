<template>
  {{ timeSecond }}
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { getter, type TimeFormat } from './InputMaskTime.vue';


export default defineComponent({
  name: 'ReportTime',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    timeFormat: {
      type: String as PropType<TimeFormat>,
      default: function () {
        return 'long' as TimeFormat;
      },
    },
    prefix: {
      type: String,
      default: function () {
        return '+T';
      },
    }
  },
  computed: {
    timeSecond: getter,
  }
});
</script>

