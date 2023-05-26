<template>
  <div class="submitReportForm__ready-substance-cont" v-if="substancesArray?.length">
    <ul class="submitReportForm__sub-list">
      <li v-for="(sub, index) in substancesArray" v-bind:key="index">
        <Panel :header="sub.namePsychonautWikiOrg + sub.dose + sub.doseUnit" class="substance-cont" toggleable :collapsed="true">
          <p class="m-0">
            Dose: {{ sub.dose }}<br/>
            Dose Unit: {{ sub.doseUnit }} <br/>
            Time: {{ sub.timeSecond }}<br/>
            Quality percent: {{ sub.surePercent }}<br/>
            Name on Psychonaut Wiki Org: {{ sub.namePsychonautWikiOrg }}<br/>
            Route of administration: {{ sub.routeOfAdministration }}<br/>
          </p>
        </Panel>
        <Button label="Edit" v-if="editSubstance" v-on:click="editSubstance(index)" />
        <Button label="Delete" severity="danger" v-if="deleteSubstance" v-on:click="deleteSubstance(index)" />
      </li>
    </ul>
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
  name: "SubmitSubstanceData",
  props: {
    substancesArray: Array as PropType<SubstanceData[]>,
    editSubstance: Function,
    deleteSubstance: Function
  },
});
</script>

<style scoped lang="scss">

.submitReportForm__sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

</style>