<template>
  <div class="substanceForm" v-if="item">
    {{ item }}
    <div class="substanceForm__main-cont">
      <div class="substanceForm__cont-block">
      <h3 class="substanceReportForm__title">Substance name</h3>
      <select
        class="substanceForm__select"
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
      <div class="substanceForm__cont-block">
        <h3 class="substanceReportForm__title">Choose active substance</h3>
        <select
          class="substanceForm__select"
          @change="onSelect"
          id="activeSubstance"
          v-bind:value="item?.activeSubstance">
          <option
            v-for="option in namePsychonautWikiOrgOptions"
            :value="option"
            v-bind:key="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="substanceForm__cont-block">
        <h3 class="substanceReportForm__title">Choose dosage unit</h3>
        <select
          class="substanceForm__select"
          @change="onSelect"
          id="doseUnit"
          v-bind:value="item?.doseUnit">
          <option v-for="option in doseUnitOptions" :value="option" v-bind:key="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="substanceForm__cont-block">
        <h3 class="substanceReportForm__title">Choose amount</h3>
        <input
          type="number"
          class="substanceForm__select"
          id="dose"
          v-bind:value="item?.dose"
          @change="onInput"
          @keyup="onInput" />
      </div>
      <div class="substanceForm__cont-block">
        <h3 class="substanceReportForm__title">Choose route of administration</h3>
        <select
          id="routeOfAdministration"
          class="substanceForm__select"
          @change="onSelect"
          v-bind:value="item?.routeOfAdministration">
          <option
            v-for="option in routeOfAdministrationOptions"
            :value="option"
            v-bind:key="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="substanceForm__cont-block">
        <h3 class="substanceReportForm__title">
          How much you sure about the quality of the substance?
        </h3>
        <select
          class="substanceForm__select"
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
      <div class="substanceForm__cont-block">
        <h3 class="substanceReportForm__title">Select time of input</h3>
        <select
          class="substanceForm__select"
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
      </div>
    </div>
    <button
      v-on:click="pushSubstanceData"
      class="substanceForm__add-sub-data-but">Add substance data
    </button>
    <span>If this is the substance you took in the very begining, then choose zero.</span>
        <!-- eslint-disable-next-line max-len -->
    <span>Both of the timelines(substance input, reporting) starts with the first substance input.</span>
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
.substanceForm {
  display: flex;
  flex-direction: column;
  margin: 5vh 0;
}
.substanceForm__select {
  margin: auto;
  text-align: center;
  margin: 5vh 0;
}
.substanceForm__cont {
  display: flex;

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
  justify-content: space-between;
  padding: 1vh;
}
.substanceForm__main-cont {
  display: flex;
  flex-direction: row;
}
.substanceForm__add-sub-data-but {
  border-radius: 15px;
  border: 1px solid black;
  margin: auto;
}
</style>
