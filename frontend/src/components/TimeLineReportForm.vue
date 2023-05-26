<!-- eslint-disable vue/no-mutating-props  -->
<!-- use this rule because we are too lazy to not mutate "item" prop which is designed to be mutated -->
<template>
  <div class="reportForm__cont" v-if="item">
    <div class="reportForm__cont-block">
      <span class=" substanceForm__cont-block_small p-float-label">
          <InputNumber
            class="reportForm__select"
            v-model:modelValue="item.timeSecond"
          />
          <label :for="id('timeSecond')">Time in minutes</label>
      </span>
      <small :id="id('timeSecond')">You can estimate the time since the substance administration.</small>
    </div>
    <div class="reportForm__cont-block">
      <span class="p-float-label">
        <Textarea
          :id="id('reportText')"
          class="p-inputtext-lg reportForm__text-area"
          v-model:modelValue="item.report"
          aria-describedby="report-text"
        >
        </Textarea>
        <label :for="id('reportText')">Report text</label>
      </span>
      <small :id="id('report-text')">Type here everything you consider relevant to describe your expirience.</small>
    </div>
    <Button :disabled="item.report.length == 0" class="reportForm__but" v-on:click="pushReportData">
      Add report text
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

type TimeLineReport = {
  timeSecond: number;
  report: string;
  dataCompleted: Function;
  simple: boolean;
};

export default defineComponent({
  name: 'TimeLineReportForm',
  props: {
    item: Object as PropType<TimeLineReport>,
  },
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
    };
  },
  emits: ['update:item'],
  setup(props, { emit }) {
    emit('update:item');
  },
  methods: {
    id(id: string) {
      return this.uid + id.toString();
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

$break-point-mobile:480px;

.reportForm__cont {
  display: flex;
  flex-direction: column;
}
.reportForm__text-area {
  padding: 0;
  width: 100%;
  height: 15vh;
}
.reportForm__cont-block {
  margin: 3vh 0
}
.reportForm__but {
  margin: 3vh auto;
}
.submitReportForm__title_left {
  margin-left: 0;
}

@media (max-width: $break-point-mobile) {
  .reportForm__but {
    margin: 0 auto 1vh;
  }
}

</style>
