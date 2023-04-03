<template>
  <div class="submitForm__cont" v-if="item">
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">Choose time line</h3>
      <span>You can estimate the timeline value since the substance administration.</span>
      <select
        class="submitForm__select"
        @change="onSelect"
        id="timeSecond"
        placeholder="item?.namePsychonautWikiOrg"
        v-bind:value="item?.timeSecond">
        <option>0</option>
        <option>5</option>
        <option>10</option>
        <option>15</option>
        <option>20</option>
        <option>30</option>
        <option>40</option>
        <option>50</option>
        <option>60</option>
        <option>80</option>
        <option>100</option>
      </select>
      <!-- eslint-disable-next-line max-len -->
      <h3 class="submitReportForm__title">Few(or not! ;) words about your feelings, thoughts, dreams, etc. at the selected time.</h3>
      <textarea
        id="reportText"
        v-bind:value="item?.report"
        placeholder="add your report"
        @keypress="onInput">
      </textarea>
      <button v-if="item?.report" v-on:click="pushReportData">Add report data</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

type TimeLineReport = {
  timeSecond: number;
  report: string;
  dataCompleted: Function;
};

export default defineComponent({
  name: 'TimeLineReportForm',
  props: {
    item: Object as PropType<TimeLineReport>,
  },
  emits: ['update:item'],
  setup(props, { emit }) {
    emit('update:item');
  },
  methods: {
    onSelect(event: any) {
      let changedProp: Partial<TimeLineReport> = {};
      if (event.target !== null && this.item && event.target.id === 'timeSecond') {
        console.log(typeof event.target.value);
        changedProp = { timeSecond: Number(event.target.value) };
      }
      this.$emit('update:item', changedProp);
    },
    onInput(event: any) {
      let changedProp: Partial<TimeLineReport> = {};
      if (event.target !== null && this.item && event.target.id === 'reportText') {
        changedProp = { report: event.target.value };
      }
      this.$emit('update:item', changedProp);
    },
    pushReportData() {
      if (this.item) {
        this.item.dataCompleted();
      }
    },
  },
});
</script>
