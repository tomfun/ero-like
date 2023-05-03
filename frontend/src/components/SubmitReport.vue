<template>
  <div class="submitReportForm">
    Only registered users can submit reports
    <router-link :to="{ name: 'UserRegistration' }">register</router-link>
    <h1 class="submitReportForm__title">Submit Form</h1>
    <div class="submitReportForm__main-cont">
      <div class="submitForm__title-cont">
        <h2 class="submitReportForm__title">Title your report</h2>
        <InputText class="submitForm__title-input" v-model="reportData.title" placeholder="Add title" />
      </div>
      <TabView v-on:tab-change="handleTabChange">
        <TabPanel header="Simple">
          <div class="submitReportForm__staged-sub-cont">
            <div class="submitReportForm__ready-substance-cont" v-if="reportData.substances.length">
              <h2 class="submitReportForm__title">Ready substances data for submit:</h2>
              <ul>
                <li v-for="(sub, index) in reportData.substances" v-bind:key="index">
                  <h3>{{ index + 1 }}:</h3>
                  {{ sub }}
                  <button v-on:click="editSubstance(index)">Edit</button>
                </li>
              </ul>
            </div>
            <button
              v-on:click="handleAddSubstance"
              :disabled="addSubstanceButtonDisable"
              class="submitReportForm__add-sub-but">
              Add substance form
            </button>
            <div style="display: flex;" v-if="staged">
              <SubstanceForm v-bind:item="stagedSubstance" @update:item="updateSubForm" />
            </div>
            <Textarea
              id="reportText"
              class="submitReportForm__text-area"
              v-model="simpleReportText"
              placeholder="add your report"
              >
            </Textarea>
          </div>
        </TabPanel>
        <TabPanel header="Timelined">
          <div class="submitReportForm__time-line-cont">
            <div class="submitReportForm__ready-substance-cont" v-if="reportData.substances.length">
              <h2 class="submitReportForm__title">Ready substances data for submit:</h2>
              <ul>
                <li v-for="(sub, index) in reportData.substances" v-bind:key="index">
                  <h3>{{ index + 1 }}:</h3>
                  {{ sub }}
                  <button v-on:click="editSubstance(index)">Edit</button>
                </li>
              </ul>
            </div>
            <button
              v-on:click="handleAddSubstance"
              :disabled="addSubstanceButtonDisable"
              class="submitReportForm__add-sub-but">
              Add substance form
            </button>
            <div style="display: flex;" v-if="staged">
              <SubstanceForm v-bind:item="stagedSubstance" @update:item="updateSubForm"/>
            </div>
            <h2 class="submitReportForm__title">Tell us about your journey in details</h2>
            <button v-on:click="handleAddTimeLineReport" :disabled="addReportButtonDisable">
              Add time line form
            </button>
            <div style="display: flex;" v-if="stagedRep">
              <TimeLineReportForm v-bind:item="stagedReport" @update:item="updateRepForm" />          
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
        </TabPanel>
      </TabView>
      <div class="submitReportForm__ready-time-line-cont">
        <Textarea
          class="submitReportForm__text-area"
          v-model="reportData.background"
          placeholder="Tell us about yourself">
        </Textarea>
      </div>
      <button v-on:click="handleValidation">Validate</button>
      <div class="submitReportForm__errors-cont" v-if="errors.length">
        <h3>Errors:</h3>
        <Message severity="error" v-for="(error) in errors" :key="error">
          {{ error }}
        </Message>
      </div>
      <div class="submitReportForm__validJson-cont" v-if="validReport">
        <Message severity="success">
          the report is valid!
        </Message>
        <h3>Valid JSON ready for submit:</h3>
        {{ validJson }}
        <Panel header="How do clear sign" toggleable :collapsed="true">
          <p class="m-0">
            Select the user you want to sign the report<br/>
            List all users:<br/>
            <code>gpg --list-keys</code><br/>
            For details:
            <a
              href="https://docs.github.com/en/authentication/managing-commit-signature-verification/checking-for-existing-gpg-keys">
              Detailed instructions
            </a><br/>
            After you had decided which user to use you need to use it instead of $user:<br/>
            <code>echo -e '$YOUR_JSON' | gpg --clear-sign --local-user </code>
            <b>$user</b>
            <code> - </code><br/>
            After that you have to select all text result, copy, and paste it in the field in the bottom.
          </p>
        </Panel>
        <Textarea v-model="clearSignArmored"
                  name="clearSignArmored"
                  id="clearSignArmored"
                  cols="66"
                  :auto-resize="true"
                  placeholder="-----BEGIN PGP SIGNED MESSAGE-----
                    Hash: SHA256
                    I read and agree with all terms of use of ero-like and confirm my registration on ero-like
                    -----BEGIN PGP SIGNATURE-----
                    iQIzBAABCgAdFiEEVUcfD9jeufsD1JVP3UX6TcUPhfEFAmC7Q2gACgkQ3UX6TcUP
                    ....
                      .
                      .
                    ....
                    TaVHnbJ8jErfklgnRTPibX8AdmEFJasONNMJ/7euoBoH+aAYG/k=
                    =B0/L
                    -----END PGP SIGNATURE-----"/>
        <Button @click="submit" v-if="clearSignArmored.length">Submit</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubstanceForm from './SubstanceForm.vue';
import TimeLineReportForm from './TimeLineReportForm.vue';
import TabView, { type TabViewClickEvent } from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

type Substance = {
  timeSecond: number;
  dose: number;
  doseUnit: string;
  namePsychonautWikiOrg: string;
  routeOfAdministration: string;
  activeSubstance: string;
  surePercent: number;
  dataCompleted: () => void;
};

type TimeLineReport = {
  timeSecond: number;
  report: string;
  dataCompleted: Function;
  simple: boolean;
};

type ReportData = {
  substances: Substance[];
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
    TabView,
    TabPanel,
  },
  mounted() {
    this.handleAddSubstance();
    this.handleAddTimeLineReport();
  },
  data() {
    return {
      reportData: {
        substances: [],
        timeLineReport: [],
        background: '',
        dateTimestamp: 0,
        title: '',
      } as ReportData,
      stagedSubstance: Object as unknown as Substance,
      staged: true as boolean,
      stagedReport: Object as unknown as TimeLineReport,
      stagedRep: false as boolean,
      simpleReportText: '' as string,
      simple: true as boolean,
      errors: [] as string[],
      validReport: false as boolean,
      validJson: Object as unknown as Substance,
      clearSignArmored: '',
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
    handleTabChange(event: TabViewClickEvent) {
      if (event.index === 0 && this.reportData.timeLineReport.length > 0) {
        const simpleReport = this.reportData.timeLineReport.reduce((cumulatedRep, curRep) => {
          return ({
            report: cumulatedRep.report + '\n' + curRep.report,
            timeSecond: 0,
            simple: true,
            dataCompleted: () => {},
          });
        });
        this.simpleReportText = simpleReport.report;
        this.simple = true;
      } 
      if (event.index === 1) {
        this.simple = false;
      }
    },
    async handleValidation() {
      const requestOptions = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          substances: [...this.reportData.substances],
          timeLineReport: this.simple ? [{
            timeSecond: 0,
            report: this.simpleReportText,
          }] : [...this.reportData.timeLineReport],
          title: this.reportData.title,
          background: this.reportData.background,
          dateTimestamp: Date.now(),
        }),
      };
      const response = await fetch('/api/report/validate', requestOptions);
      const data = await response.json();
      console.log(data);
      if (data.error) {
        this.errors = [...data.message];
        this.validReport = false;
        return
      }
      if (data.dateTimestamp > 0) { // validation for success...
        this.validJson = data;
        this.errors = [];
        this.validReport = true;
      }
      console.log(this.errors, this.validJson);
    },
    async submit() {
      const requestOptions = {
        method: 'Put',
        headers: {
          'Content-Type': 'text/plain'},
        body: this.clearSignArmored,
      };
      const response = await fetch('/api/report', requestOptions);
      const data = await response.json();
      console.log(data);
    },
    handleAddTimeLineReport() {
      const report: TimeLineReport = {
        timeSecond: 0,
        report: '',
        dataCompleted: () => {
          this.reportData.timeLineReport = [...this.reportData.timeLineReport, this.stagedReport];
          this.stagedRep = false;
        },
        simple: true,
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
    updateSubForm(params: Partial<Substance>) {
      this.stagedSubstance = {
        ...this.stagedSubstance,
        ...params,
      };
    },
    handleAddSubstance() {
      const substance: Substance = {
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
    editSubstance(index: number) {
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

.submitReportForm__main-cont {
  width: 85%;
  margin: auto;
}

.submitReportForm__add-sub-but {
  border-radius: 15px;
  border: 1px solid black;
  margin: auto;
}
.submitReportForm__staged-sub-cont {
  display: flex;
  flex-direction: column;
}
.submitReportForm__text-area {
  width: 40%;
  height: 7vh;
}
</style>
