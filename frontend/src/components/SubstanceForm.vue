<!-- eslint-disable vue/no-mutating-props -->
<!-- use this rule because we are too lazy to not mutate "item" prop which is designed to be mutated -->
<template>
  <div class="substanceForm" v-if="item">
    <div class="substanceForm__main-cont">
      <div class="substanceForm__row-block">
        <div class="substanceForm__cont-block">
          <div class="p-float-label">
            <Dropdown
              :inputId="id('name-sub')"
              class="substanceForm__select"
              v-model:modelValue="item.namePsychonautWikiOrg"
              :options="namePsychonautWikiOrgOptions"
            />
            <label :for="id('name-sub')">Substance name</label>
          </div>
        </div>
        <div class="substanceForm__cont-block">
          <div class="p-float-label">
            <Dropdown
              :inputId="id('active-sub')"
              class="substanceForm__select"
              v-model:modelValue="item.activeSubstance"
              :options="namePsychonautWikiOrgOptions"
            />
            <label :for="id('active-sub')">Active substance</label>
          </div>
        </div>
      </div>
      <div class="substanceForm__row-block">
        <div class="substanceForm__cont-block">
          <div class="p-float-label">
            <Dropdown
              :inputId="id('route')"
              class="substanceForm__select"
              :options="routeOfAdministrationOptions"
              v-model:modelValue="item.routeOfAdministration"
            />
            <label :for="id('route')">Route of administration</label>
          </div>
        </div>
        <div class="substanceForm__cont-block">
          <div class="p-float-label">
            <Dropdown
              :inputId="id('dose-unit')"
              class="substanceForm__select"
              v-model:modelValue="item.doseUnit"
              :options="doseUnitOptions"
            />
            <label :for="id('dose-unit')">Dosage unit</label>
          </div>
        </div>
        <div class="substanceForm__cont-block substanceForm__cont-block_small">
          <span class=" substanceForm__cont-block_small p-float-label">
            <InputNumber
              v-model:modelValue="item.dose"
            />
            <label :for="id('dose')">Amount</label>
          </span>
        </div>
      </div>
      <div class="substanceForm__row-block">
        <div class="substanceForm__cont-block">
          <span class="p-float-label">
            <Dropdown
              :inputId="id('qualityPercent')"
              class="substanceForm__select"
              v-model:modelValue="item.surePercent"
              :options="percentOptions"
            />
            <label :for="id('qualityPercent')">Quality percent</label>
          </span>
          <small :id="id('qualityPercent')">How much you sure about the quality of the substance?</small>
        </div>
        <div class="substanceForm__cont-block">
          <div class="p-float-label">
            <InputNumber
              class="substanceForm__select"
              v-model:modelValue="item.timeSecond"
            />
            <label :for="id('dose-unit')">Time of input</label>
          </div>
        </div>
      </div>
      <Button
        v-on:click="pushSubstanceData"
        class="substanceForm__add-sub-data-but">Add substance data
      </Button>
      <Message severity="warn">If this is the substance you took in the very begining, then choose zero.</Message>
      <Message severity="warn"> Both of the timelines(substance input, reporting) starts with the first substance input. </Message>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

type SubstanceData = {
  timeSecond: number;
  dose: number;
  doseUnit: string;
  namePsychonautWikiOrg: string;
  routeOfAdministration: string;
  activeSubstance: string;
  surePercent: number;
  dataCompleted: Function;
};

export default defineComponent({
  name: "SubstanceForm",
  props: {
    item: {
      type: Object as PropType<SubstanceData>,
      default: () => ({})
    },
  },
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
      namePsychonautWikiOrgOptions: ["heroin", "2C-B", "2C-I", "DOB", "LSA", "LSD", "MDMA"],
      activeSubstanceOptions: ["heroin", "2C-B", "2C-I", "DOB", "LSA", "LSD", "MDMA"],
      doseUnitOptions: ["mg", "µg", "g"],
      routeOfAdministrationOptions: ["oral", "sublingual", "insufflated", "intravenous", "smoked", "rectal", "transdermal", "intramuscular"],
      percentOptions: [10, 20, 30, 40, 50, 60, 70, 80, 90, 99]
    };
  },
  methods: {
    id(id: string) {
      return this.uid + id.toString();
    },
    pushSubstanceData() {
      if (this.item) {
        this.item.dataCompleted();
      }
    },
  },
});
</script>

<style scoped lang="scss">
.substanceForm {
  display: flex;
  flex-direction: column;
  margin: 0 0 5vh 0;
}
.substanceForm__row-block {
  display: flex;
  margin: auto;
  justify-content: space-between;
  width: 100%;
}
.substanceForm__main-cont {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
}
.substanceForm__select {
  width: 100%;
}
// .substanceForm__select_small {
//   width: 30%;
// }
.substanceForm__cont-block_small {
  width: 30%;
}

.substanceReportForm__title {
  margin: 2vh auto;
  text-align: center;
  font-size: 14px;
  margin: 0;
}
.substanceForm__cont-block {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 5vh 1vh;
}

.substanceForm__add-sub-data-but {
  margin: auto;
}

$break-point-medium: 980px;

@media (max-width: $break-point-medium) {
  .substanceForm__row-block {
    flex-direction: column;
  }
  .substanceForm__cont-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 1.5vh 0;
  }
}
</style>
