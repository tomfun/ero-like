<template>
  <div class="submitReportForm">
    Only registered users can submit reports
    <router-link :to="{ name: 'UserRegistration' }">register</router-link>
    <h1 class="submitReportForm__title">Submit Form</h1>
    {{ reportData }}
    <div class="submitForm">
      <div class="submitForm__title-cont">
        <h2 class="submitReportForm__title">Title your report</h2>
        <input class="submitForm__title-input" v-model="reportData.title" placeholder="Add title">
      </div>
      <Tabs>
        <tab title="Substances">
          <h3>Substances</h3>
          <button v-on:click="handleAddSubstance" :disabled="addSubstanceButtonDisable">
            Add substance form
          </button>
          <div style="display: flex;" v-if="staged">
            <SubstanceForm v-model="stagedSubstance" v-bind:item="stagedSubstance"
            @update:item="updateSubForm"/>
          </div>
          <div class="submitReportForm__ready-substance-cont" v-if="reportData.substances.length">
            <h2 class="submitReportForm__title">Ready substances data for submit:</h2>
            <ul>
              <li v-for="(sub, index) in reportData.substances" v-bind:key="index">
                <h3>{{ index + 1 }}:</h3>
                {{ sub }}
                <button v-on:click="editSubstanceData(index)">Edit</button>
              </li>
            </ul>
          </div>
        </tab>
        <tab title="Form">
          <div class="submitReportForm__time-line-cont">
            <h2 class="submitReportForm__title">Tell us about your journey in details</h2>
            <button v-on:click="handleAddTimeLineReport" :disabled="addReportButtonDisable">
              Add time line form
            </button>
            <div style="display: flex;" v-if="stagedRep">
              <TimeLineReportForm v-model="stagedReport" v-bind:item="stagedReport"
              @update:item="updateRepForm"/>
            </div>
          </div>
          <div class="submitReportForm__ready-time-line-cont"
            v-if="reportData.timeLineReport.length">
          <h2 class="submitReportForm__title">Ready report data for submit:</h2>
            <ul>
              <li v-for="(sub, index) in reportData.timeLineReport" v-bind:key="index">
                <h3>{{ index + 1 }}:</h3>
                {{ sub }}
                <button v-on:click="editReportData(index)">Edit</button>
              </li>
            </ul>
          </div>
        </tab>
      </Tabs>
      <div class="submitReportForm__ready-time-line-cont" v-if="reportData.timeLineReport.length">
        <h2 class="submitReportForm__title">Tell us few words about your background:</h2>
        <textarea v-model="reportData.background" placeholder="add your background"></textarea>
      </div>
      <button v-on:click="handleValidation">Validate</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubstanceForm from './SubstanceForm.vue';
import TimeLineReportForm from './TimeLineReportForm.vue';
import Tabs from './Tabs.vue';
import Tab from './Tab.vue';

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

type TimeLineReport = {
  timeSecond: number;
  report: string;
  dataCompleted: Function;
};

type ReportData = {
  substances: SubstanceData[];
  timeLineReport: TimeLineReport[];
  background: string;
  dateTimestamp: number;
  title: string;
};

export default defineComponent({
  name: 'SubmitReport',
  components: {
    SubstanceForm,
    TimeLineReportForm,
    Tabs,
    Tab,
  },
  data() {
    return {
      reportData: {
        substances: [],
        timeLineReport: [],
        background: '',
        dateTimestamp: 0,
        title: '',
      } as unknown as ReportData,
      stagedSubstance: Object as unknown as SubstanceData,
      staged: false as boolean,
      stagedReport: Object as unknown as TimeLineReport,
      stagedRep: false as boolean,
    };
  },
  computed: {
    addSubstanceButtonDisable() {
      if (this.staged) {
        return true;
      }
      return false;
    },
    addReportButtonDisable() {
      if (this.stagedRep) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async handleValidation() {
      const requestOptions = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          substances: [...this.reportData.substances],
          timeLineReport: [...this.reportData.timeLineReport],
          title: this.reportData.title,
          background: this.reportData.background,
          dateTimestamp: Date.now(),
        }),
      };
      const response = await fetch('/api/report/validate', requestOptions);
      const data = await response.json();
      console.log(data);
      // this.$data.id = data.id;
      // this.$data.nick = data.nick;
      // this.$data.title = data.title;
      // this.$data.reportText = data.reportText; // ... hm
      // this.$data.gpgSignature = data.gpgSignature;
    },
    handleAddTimeLineReport() {
      const report: TimeLineReport = {
        timeSecond: 0,
        report: '',
        dataCompleted: () => {
          this.reportData.timeLineReport = [...this.reportData.timeLineReport, this.stagedReport];
          this.stagedRep = false;
        },
      };
      this.stagedReport = report;
      this.stagedRep = true;
    },
    updateRepForm(params: Partial<TimeLineReport>) {
      this.stagedReport = {
        ...this.stagedReport,
        ...params,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSubForm(params: Partial<SubstanceData>) {
      this.stagedSubstance = {
        ...this.stagedSubstance,
        ...params,
      };
    },
    handleAddSubstance() {
      const substance: SubstanceData = {
        timeSecond: 0,
        dose: 0,
        doseUnit: '',
        namePsychonautWikiOrg: '',
        routeOfAdministration: '',
        activeSubstance: '',
        surePercent: 0,
        dataCompleted: () => {
          this.reportData.substances = [...this.reportData.substances, this.stagedSubstance];
          this.staged = false;
          // here it's necessary to reset the stagedSubstance I guess...
        },
      };
      this.stagedSubstance = substance;
      this.staged = true;
    },
    editSubstanceData(index: number) {
      this.handleAddSubstance();
      this.stagedSubstance = { ...this.reportData.substances[index] };
      this.reportData.substances.splice(index, 1);
    },
    editReportData(index: number) {
      this.handleAddTimeLineReport();
      this.stagedReport = { ...this.reportData.timeLineReport[index] };
      this.reportData.timeLineReport.splice(index, 1);
    },
  },
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.submitReportForm__title {
  margin: 2vh auto;
  text-align: center;
}
.submitForm {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 5vh auto;
}
.submitForm__title-cont {
  margin: auto;
  display: flex;
  flex-direction: column;
}
.submitReportForm__substance-cont {
  margin: 5vh auto;
  display: flex;
  flex-direction: column;
}
.submitForm__title-input {
  margin: auto;
}

.submitReportForm__substance-form-cont {

}
</style>
