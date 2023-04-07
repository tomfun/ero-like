<template>
  <div class="submitForm__cont" v-if="item">
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">Choose substance name</h3>
      <select
        class="submitForm__select"
        @change="onSelect"
        id="namePsychonautWikiOrg"
        placeholder="item?.namePsychonautWikiOrg"
        v-bind:value="item?.namePsychonautWikiOrg"
        >
        <option v-for="option in namePsychonautWikiOrgOptions" :value="option" v-bind:key="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">Choose active substance</h3>
      <select
        class="submitForm__select"
        @change="onSelect"
        id="activeSubstance"
        v-bind:value="item?.activeSubstance">
        <option v-for="option in namePsychonautWikiOrgOptions" :value="option" v-bind:key="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">Choose dosage unit</h3>
      <select
        class="submitForm__select"
        @change="onSelect"
        id="doseUnit"
        v-bind:value="item?.doseUnit">
        <option v-for="option in doseUnitOptions" :value="option" v-bind:key="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">Choose amount</h3>
      <input
        type="number"
        class="submitForm__select"
        id="dose"
        v-bind:value="item?.dose"
        @keyup="onInput" />
    </div>
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">Choose route of administration</h3>
      <select
        id="routeOfAdministration"
        class="submitForm__select"
        @change="onSelect"
        v-bind:value="item?.routeOfAdministration">
        <option v-for="option in routeOfAdministrationOptions" :value="option" v-bind:key="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">How much you sure about the quality of the substance?</h3>
      <select
        class="submitForm__select"
        @change="onSelect"
        id="surePercent"
        v-bind:value="item?.surePercent">
        <option>10</option>
        <option>20</option>
        <option>30</option>
        <option>40</option>
        <option>50</option>
        <option>60</option>
        <option>70</option>
        <option>80</option>
        <option>90</option>
        <option>100</option>
      </select>
    </div>
    <div class="submitForm__cont-block">
      <h3 class="submitReportForm__title">Select time of input</h3>
      <select
        class="submitForm__select"
        @change="onSelect"
        id="timeSecond"
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
      <span>If this is the substance you took in the very begining, then choose zero.</span>
      <!-- eslint-disable-next-line max-len -->
      <span>Both of the timelines(substance input, reporting) starts with the first substance input.</span>
    </div>
    <button v-on:click="pushSubstanceData">Add substance data</button>
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
  name: 'SubstanceForm',
  props: {
    item: Object as PropType<SubstanceData>,
  },
  emits: ['update:item'],
  setup(props, { emit }) {
    emit('update:item');
  },
  data() {
    return {
      namePsychonautWikiOrgOptions: ['heroin', '2C-B', '2C-I', 'DOB', 'LSA', 'LSD', 'MDMA'],
      activeSubstanceOptions: ['heroin', '2C-B', '2C-I', 'DOB', 'LSA', 'LSD', 'MDMA'],
      doseUnitOptions: ['mg', 'µg', 'g'],
      routeOfAdministrationOptions: ['oral', 'sublingual', 'insufflated', 'intravenous', 'smoked', 'rectal', 'transdermal'],
    };
  },
  methods: {
    onSelect(event: any) {
      if (event.target !== null && this.item) {
        let changedProp: Partial<SubstanceData> = {};
        switch (event.target.id) {
          case 'timeSecond':
            changedProp = { timeSecond: Number(event.target.value) };
            break;
          case 'namePsychonautWikiOrg':
            changedProp = { namePsychonautWikiOrg: event.target.value };
            break;
          case 'routeOfAdministration':
            changedProp = { routeOfAdministration: event.target.value };
            break;
          case 'activeSubstance':
            changedProp = { activeSubstance: event.target.value };
            break;
          case 'surePercent':
            changedProp = { surePercent: Number(event.target.value) };
            break;
          case 'doseUnit':
            changedProp = { doseUnit: event.target.value };
            break;
          default:
            changedProp = {};
        }
        this.$emit('update:item', changedProp);
      }
    },
    onInput(event: any) {
      let changedProp: Partial<SubstanceData> = {};
      if (event.target !== null && this.item && event.target.id === 'dose') {
        changedProp = { dose: Number(event.target.value) };
      }
      this.$emit('update:item', changedProp);
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
.submitForm__select {
  margin: auto;
  text-align: center;
}
.submitForm__cont {
  display: flex;
  flex-direction: column;
}
.submitReportForm__title {
  margin: 2vh auto;
  text-align: center;
}
.submitForm__cont-block {
  display: flex;
  flex-direction: column;
}
</style>
