<template>
  <div class="substance border-bluegray-100 grid">
    <div class="col formgrid grid">
      <div class="field col-2 min-w-min">
        <div class="p-float-label p-float-label-shift">
          <InputMaskTime
            :inputId="id('timeSecond')"
            :aria-describedby="id('timeSecondHelp')"
            :timeFormat="timeFormat"
            :modelValue="modelValue.timeSecond"
            :allow0="isFirst"
            @update:modelValue="setSingleValue('timeSecond', $event)"
          />
          <label :for="id('timeSecond')">Time</label>
          <small :id="id('timeSecondHelp')"
            >You can estimate the time since the first substance administration.</small
          >
        </div>
      </div>
      <div class="field col min-w-min">
        <div class="p-float-label p-float-label-shift">
          <Textarea
            :inputId="id('report')"
            :aria-describedby="id('report-text')"
            class="w-full"
            :modelValue="modelValue.report"
            @update:modelValue="setSingleValue('report', $event)"
            autoResize
          />
          <label :for="id('timeSecond')">Report text</label>
          <small :id="id('report-text')"
            >Type here you thoughts, feelings, effects, everything you consider relevant
            to describe your experience.</small
          >
        </div>
      </div>
    </div>
    <div class="col-fixed w-4rem p-buttonset text-right">
      <Button
        severity="secondary"
        size="small"
        outlined
        v-tooltip="$t('Remove')"
        v-on:click="rm"
      >
        <span class="pi pi-times"></span>
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import type { ReportTimeLineItemAlpha1 } from '../services/api'
import { defineComponent } from 'vue'
import InputMaskTime, { type TimeFormat } from './InputMaskTime.vue'

export type T = ReportTimeLineItemAlpha1

export default defineComponent({
  name: 'SubstanceItem',
  components: { InputMaskTime },
  props: {
    modelValue: {
      default: function () {
        return {
          timeSecond: 1,
          report: '',
        } as T
      },
    },
    isFirst: {
      default: function () {
        return false as boolean
      },
    },
    rm: {
      default: function () {
        return (() => null) as (payload: MouseEvent) => void
      },
    },
    timeFormat: {
      default: function () {
        return 'long' as TimeFormat
      },
    },
  },
  emits: {
    'update:modelValue'(item: T) {
      return typeof item === 'object' && typeof item.timeSecond === 'number'
    },
  },
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
    }
  },
  methods: {
    id(id: string) {
      return this.uid + id.toString()
    },
    setSingleValue(key: keyof T, value: T[keyof T]) {
      this.setNewValue({ [key]: value })
    },
    setNewValue(value: Partial<T>) {
      const newValue: T = Object.assign(this.modelValue, value)
      this.$emit('update:modelValue', newValue)
    },
  },
})
</script>

<style scoped lang="scss">
.substance {
  padding-top: 1.5em;
  margin-top: 0.5em;
  .formgrid {
    margin: 0.5em 0;
  }
  border-bottom: solid 1px var(--bluegray-100);
  .field {
    padding-top: 1em;
    min-width: 12rem;
  }
}
</style>
