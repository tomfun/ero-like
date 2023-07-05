<template>
  <div class="formgrid grid">
    <div class="field col-12 lg:col">
      <div class="p-float-label">
        <InputText
          class="w-full"
          :id="id('title')"
          :modelValue="modelValue.title"
          @update:modelValue="setSingleValue('title', $event as string)"
          :aria-describedby="id('title-help')"
        />
        <label :for="id('title')">Title</label>
      </div>
      <small :id="id('title-help')">Enter a title the best describes your journey.</small>
    </div>
    <div class="field col-fixed min-w-min md:w-16rem">
      <div class="p-float-label">
        <Calendar
          v-model="dateTimestampDate"
          :dateFormat="dateFormatShort"
          :placeholder="dateFormatShort"
          :id="id('dateTimestampDate')"
          :aria-describedby="id('dateTimestampDateHelp')"
        />
        <label :for="id('dateTimestampDate')">Date</label>
      </div>
      <small :id="id('dateTimestampDateHelp')">Enter date of your journey.</small>
    </div>
  </div>
  <Message severity="info"
    >If this is the substance you took in the very begining, then choose zero.
  </Message>
  <Message severity="info">
    Both of the timelines(substance input, reporting) starts with the first substance
    input.
  </Message>

  <SubstanceList
    :modelValue="modelValue.substances"
    @update:modelValue="setSingleValue('substances', $event)"
    :DynamicComponent="SubstanceItem"
  />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { useFormat } from '../../format.js/useFormat'
import type { ReportDataAlpha1, ReportSubstanceAlpha1 } from '../../services/api'
import GenericOrderedList from '../GenericOrderedList.vue'
import type { TimeFormat } from '../InputMaskTime.vue'
import SubstanceItem from '../SubstanceItem.vue'

const SubstanceList = GenericOrderedList as typeof GenericOrderedList<
  ReportSubstanceAlpha1,
  typeof SubstanceItem
>

export default defineComponent({
  name: 'CommonSubmitReport',
  components: {
    SubstanceList,
  },
  props: {
    modelValue: {
      type: Object as PropType<ReportDataAlpha1>,
      required: true,
    },
    timeFormat: {
      default: function () {
        return 'long' as TimeFormat
      },
    },
  },
  emits: {
    'update:modelValue'(report: ReportDataAlpha1) {
      return typeof report === 'object' && typeof report.title === 'string'
    },
  },
  setup() {
    const { dateFormatShort } = useFormat()
    return {
      dateFormatShort,
    }
  },
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
    }
  },
  computed: {
    SubstanceItem() {
      return SubstanceItem
    },
    dateTimestampDate: {
      get(): Date {
        return new Date(this.modelValue.dateTimestamp * 1000)
      },
      set(v: Date) {
        this.setSingleValue('dateTimestamp', Math.floor(v.getTime() / 10000) * 10)
      },
    },
  },
  methods: {
    id(id: string) {
      return this.uid + id.toString()
    },
    setSingleValue(
      key: keyof ReportDataAlpha1,
      value: ReportDataAlpha1[keyof ReportDataAlpha1],
    ) {
      this.setNewValue({ [key]: value })
    },
    setNewValue(value: Partial<ReportDataAlpha1>) {
      this.$emit('update:modelValue', Object.assign(this.modelValue, value))
    },
  },
})
</script>

<style scoped lang="scss"></style>
