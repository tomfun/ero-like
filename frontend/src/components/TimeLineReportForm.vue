<template>
  <div class="submitForm__cont" v-if="item">
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">Choose time line</h3>
      <span>You can estimate the timeline value since the substance administration.</span>
      <InputText
        class="submitForm__select"
        @keyup="onInput"
        id="timeSecond"
        placeholder="item?.namePsychonautWikiOrg"
        v-bind:value="item?.timeSecond" />
      <Textarea
        id="reportText"
        class="submitReportForm__text-area"
        v-bind:value="item?.report"
        placeholder="add your report"
        @keyup="onInput">
      </Textarea>
      <button v-if="item?.report" v-on:click="pushReportData">
        Add report data
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import type { PropType } from 'vue';

type TimeLineReport = {
  timeSecond: number;
  report: string;
  dataCompleted: Function;
  simple: boolean;
};

export default defineComponent({
  name: 'TimeLineReportForm',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Textarea,
    InputText
  },
  props: {
    item: Object as PropType<TimeLineReport>,
  },
  emits: ['update:item'],
  setup(props, { emit }) {
    emit('update:item');
  },
  methods: {
    onInput(event: any) {
      let changedProp: Partial<TimeLineReport> = {};
      if (event.target !== null && this.item && event.target.id === 'reportText') {
        changedProp = { report: event.target.value };
      }
      if (event.target !== null && this.item && event.target.id === 'timeSecond') {
        changedProp = { timeSecond: Number(event.target.value) };
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

<style scoped lang="scss">
  .submitReportForm__text-area {
    width: 40%;
    height: 7vh;
  }
</style>
