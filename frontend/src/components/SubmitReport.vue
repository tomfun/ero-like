<template>
  <div class="submitReportForm">
    <div class="submitReportForm__main-cont">
      <h1 class="submitReportForm__title">{{ $t('submit_page_title') }}</h1>
      <div class="submitForm__registr-cont">
        <Message severity="warn">
          Only registered users can submit reports
          <router-link :to="{ name: 'UserRegistration' }">register</router-link>
        </Message>
      </div>
      <div class="submitForm__title-cont">

      </div>
      <div class="submitForm__info-cont">
        <Message severity="info">
          You can choose either a "simple" report to post with a single block of description,
          or the "timelined" one with time sections each with its own description.
        </Message>
      </div>
      <TabView v-on:tab-change="handleTabChange" class="reportForm__tab-panel">
        <TabPanel header="Simple">
          <div class="submitReportForm__simpleRep-cont">
            <Button
              v-if="isDev"
              label="Autofill"
              class="submitReportForm__add-sub-but"
              @click="handleFormFill"
            />
            <div class="submitForm__title-inner-cont">
              <span class="p-float-label">
                <InputText class="p-inputtext-lg" :id="id('title')" v-model="reportData.title" aria-describedby="title-help" />
                <label :for="id('title')">Title</label>
              </span>
              <small :id="id('title-help')">Enter a title the best describes your journey.</small>
            </div>
            <SubmitSubstanceData
              v-bind:substancesArray="reportData.substances"
              v-bind:editSubstance="editSubstance"
              v-bind:deleteSubstance="deleteSubstance"/>
            <Button
              v-if="!staged"
              v-on:click="handleAddSubstance"
              :disabled="addSubstanceButtonDisable"
              class="submitReportForm__add-sub-but">
              Add substance form
            </Button>
            <SubstanceForm v-show="staged" v-bind:item="stagedSubstance" />
            <div class="submitForm__cont">
              <span class="p-float-label">
                <Textarea
                  :id="id('reportText')"
                  class="p-inputtext-lg submitReportForm__text-area"
                  v-model="simpleReportText"
                  aria-describedby="report-text"
                  >
                </Textarea>
                <label :for="id('reportText')">Report text</label>
              </span>
              <small :id="id('report-text')">Type here everything you consider relevant to describe your expirience.</small>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Timelined">
          <div class="submitReportForm__time-line-cont">
            <div class="submitForm__title-inner-cont">
              <span class="p-float-label">
                <InputText class="p-inputtext-lg" :id="id('title')" v-model="reportData.title" aria-describedby="title-help" />
                <label :for="id('title')">Title</label>
              </span>
              <small :id="id('title-help')">Enter a title the best describes your journey.</small>
            </div>
            <SubmitSubstanceData
              v-bind:substancesArray="reportData.substances"
              v-bind:editSubstance="editSubstance"
              v-bind:deleteSubstance="deleteSubstance"/>
            <Button
              v-if="!staged"
              v-on:click="handleAddSubstance"
              :disabled="addSubstanceButtonDisable"
              class="submitReportForm__add-sub-but">
              Add substance form
            </Button>
            <SubstanceForm v-show="staged" v-bind:item="stagedSubstance" />
            <h3 class="submitReportForm__title_left">Tell us about your journey in details</h3>
            <div class="submitReportForm__ready-time-line-cont" v-if="reportData.timeLineReport.length">
              <ul>
                <li v-for="(rep, index) in reportData.timeLineReport" class="submitReportForm__rep-cont" v-bind:key="index">
                  <Panel :header="'timeline ' + (rep.timeSecond + 1).toString()"  toggleable :collapsed="true">
                    <p class="m-0">
                      timeline: {{ index + 1 }}<br/>
                      Report text: {{ rep }}
                    </p>
                  </Panel>
                  <Button label="Edit" v-on:click="editReportData(index)" />
                  <Button label="Delete" severity="danger" v-on:click="deleteReportData(index)" />
                </li>
              </ul>
            </div>
            <TimeLineReportForm v-bind:item="stagedReport" @update:item="updateRepForm" v-if="stagedRep"/>
            <Button
              v-if="!stagedRep"
              class="submitReportForm__add-sub-but"
              v-on:click="handleAddTimeLineReport"
              :disabled="addReportButtonDisable">
              Add time line form
            </Button>
        </div>
        </TabPanel>
      </TabView>
      <div class="submitForm__background-cont">
        <span class="p-float-label">
          <Textarea
            :id="id('backgroundText')"
            class="p-inputtext-lg submitReportForm__text-area"
            v-model="reportData.background"
            aria-describedby="background-text"
            >
          </Textarea>
          <label :for="id('backgroundText')">Background text</label>
        </span>
        <small :id="id('background-text')">Tell us about yourself</small>
      </div>
      <div class="submitForm__validation-cont">
        <Button
          :disabled="validationButtonDisable"
          class="submitReportForm__add-sub-but" v-on:click="handleValidation">Validate report</Button>
        <div class="submitReportForm__valid-status-cont" >
          <div class="submitReportForm__valid-status-err">

          </div>
          <Message v-show="errors.length" severity="error" v-for="(error) in errors" :key="error">
            {{ error }}
          </Message>
          <div class="submitReportForm__valid-status-err"></div>
          <Message v-show="validReport" severity="success">
            the report is valid!
          </Message>
        </div>
        <div class="submitForm__validation-success-cont">
          <Panel header="Report segnification" toggleable :collapsed="true" class="reportForm__sign-cont">
            <p class="m-0">
              To sign your validated report, first select the user you want to sign the report with.
            </p>
            <p class="m-0">List all users:</p>
            <div class="reportForm__code-block">
              <code class="reportForm__json-text">
                gpg --list-keys
              </code>
              <span class="reportForm__code-block-span">$your command line</span>
            </div>
            <p class="m-0"> Paste in your local CMD the next code replacing $user with your value:</p>
            <div class="reportForm__code-block">
              <code class="reportForm__json-text">
                echo -e '{{ validJson }}' | gpg --clear-sign --disable-signer-uid --local-user
                <b>$user</b>
              </code>
              <span class="reportForm__code-block-span">$your command line</span>
            </div>
            <p class="m-0">Copy the result and paste it in the next window.</p>
          </Panel>
          <div class="flex flex-column gap-2 submitForm__clear-sign-text-input">
            <label :for="id('clearSignArmored')">Signed report:</label>
            <Textarea
              v-model="clearSignArmored"
              name="clearSignArmored"
              :id="id('clearSignArmored')"
              cols="66"
              rows="6"
              placeholder="-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256
{ <<YOUR JSON>> }
-----BEGIN PGP SIGNATURE-----
iQIzBAABCgAdFiEEVUcfD9jeufsD1JVP3UX6TcUPhfEFAmC7Q2gACgkQ3UX6TcUP
....
  .
  .
....
TaVHnbJ8jErfklgnRTPibX8AdmEFJasONNMJ/7euoBoH+aAYG/k=
=B0/L
-----END PGP SIGNATURE-----"/>
            <small :id="id('clearSignArmored')">Paste here your validated and signed report.</small>
          </div>
          <Button class="submitReportForm__add-sub-but" @click="submit" :disabled="!clearSignArmored.length">Submit</Button>
          <div class="submitReportForm__errors-cont" v-if="submitError.length">
            <Message severity="error">
              {{ submitError }}
            </Message>
          </div>
          <div class="submitReportForm__validJson-cont" v-if="successSubmit">
            <Message severity="success">
              the report was sent successfully!
            </Message>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubstanceForm from './SubstanceForm.vue';
import TimeLineReportForm from './TimeLineReportForm.vue';
import SubmitSubstanceData from './SubmitSubstanceData.vue';
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
    SubmitSubstanceData,
    TabPanel,
    TabView
},
  mounted() {
    this.handleAddSubstance();
    this.handleAddTimeLineReport();
  },
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
      isDev: import.meta.env.DEV,
      reportData: {
        substances: [],
        timeLineReport: [],
        background: '',
        dateTimestamp: 0,
        title: '',
      } as ReportData,
      stagedSubstance: {} as Substance,
      staged: true,
      stagedReport: {} as TimeLineReport,
      stagedRep: false,
      simpleReportText: '',
      simple: true,
      errors: [] as string[],
      validReport: false,
      validJson: {},
      clearSignArmored: '',
      submitError: '',
      successSubmit: false,
    };
  },
  computed: {
    addSubstanceButtonDisable() {
      return this.staged;

    },
    addReportButtonDisable() {
      return this.stagedRep;

    },
    validationButtonDisable() {
      return this.reportData.title.length < 4 || this.reportData.background.length < 4;

    }
  },
  methods: {
    id(id: string) {
      return this.uid + id.toString();
    },
    handleFormFill() {
      const substance: Substance = {
        timeSecond: 0,
        dose: 10,
        doseUnit: 'mg',
        namePsychonautWikiOrg: 'Heroin',
        routeOfAdministration: 'intravenous',
        activeSubstance: 'Heroin',
        surePercent: 30,
        dataCompleted: () => {
          this.staged = false;
          this.reportData.substances = [...this.reportData.substances, this.stagedSubstance];
        },
      };
      this.stagedSubstance = substance;

      this.simpleReportText = 'Repppoopoo'
      this.reportData.title = 'Title';
      this.reportData.background = 'Backgroundd';
      this.reportData.dateTimestamp = Date.now() / 1000;
    },
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

      fetch('/api/report/validate', requestOptions)
        .then(async (res) => {
          if (res.ok && res.status === 200) {
            this.validJson = await res.text();
            this.errors = [];
            this.validReport = true;
            return;
          }
          this.validReport = false;
          if (res.status === 400) {
            this.errors = (await res.json()).message;
          } else {
            this.errors = ['Unknown error'];
          }
        })
        .catch(err => {
          const msg = `Request failed with error: ${err.message}`;
          this.errors = [msg];
          this.validReport = false;
        })
    },
    async submit() {
      const requestOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'text/plain'},
        body: this.clearSignArmored,
      };
      const response = await fetch('/api/report', requestOptions);
      const data = await response.json();

      if (data.statusCode && data.error) {
        this.submitError = data.message;
        this.successSubmit = false;
      }
      if (data.signature) {
        this.successSubmit = true;
        this.submitError = '';
      }
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
          this.staged = false;
          this.reportData.substances = [...this.reportData.substances, this.stagedSubstance];
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
    deleteSubstance(index: number) {
      this.reportData.substances.splice(index, 1);
    },
    editReportData(index: number) {
      this.handleAddTimeLineReport();
      this.stagedReport = { ...this.reportData.timeLineReport[index] };
      this.reportData.timeLineReport.splice(index, 1);
    },
    deleteReportData(index: number) {
      this.reportData.timeLineReport.splice(index, 1);
    }
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
.submitReportForm__title_left {
  margin: 2vh 0;
}
.submitReportForm {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1440px;
  margin: 5vh auto;
}
.submitForm__title-cont {
  margin: auto;
  display: flex;
  flex-direction: column;
}
.submitForm__title-inner-cont {
  margin: 2em auto;
}
.submitForm__info-cont {
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
.submitForm__cont {
  width: 100%;
  margin: 2vh auto;
  padding: 0;
}
.submitReportForm__add-sub-but {
  margin: 3vh auto;
}
.submitReportForm__simpleRep-cont {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: auto;
}
.submitReportForm__time-line-cont {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: auto;
}
.submitForm__validation-cont {
  width: 70%;
  margin: auto;
  display: flex;
  flex-direction: column;
}
.submitForm__validation-success-cont {
  display: flex;
  flex-direction: column;
  margin-top: 2vh;
}
.submitForm__background-cont {
  width: 70%;
  margin: 2vh auto;
}
.submitReportForm__text-area {
  padding: 0;
  width: 100%;
  height: 15vh;
}
.submitReportForm__rep-cont {
  width: 100%;
}
.reportForm__json-text {
  display: block;
  overflow: scroll;
  border: #42b983 2px solid;
  padding: 1vh;
  margin: 2vh 0;
}
.submitForm__clear-sign-text-input {
  margin-top: 5vh;
}
.reportForm__code-block-span {
  position: absolute;
  right: 0;
  top: -1.5vh;
}
.reportForm__code-block {
  position: relative;
}


$break-point-large: 1400px;

$break-point-medium: 980px;
$medium-width: 85%;

$break-point-mobile: 480px;
$mobile-width: 95%;

@media (max-width: $break-point-large) {
  .submitReportForm__main-cont {
    width: 100%;
  }
}

@media (max-width: $break-point-medium) {
  .submitReportForm__time-line-cont {
    width: $medium-width;
  }
  .submitForm__validation-cont {
    width: $medium-width;
  }
  .submitForm__background-cont {
    width: $medium-width;
  }
  .submitReportForm__simpleRep-cont {
    width: $medium-width;
  }
}

@media (max-width: $break-point-medium) {
  .submitReportForm {
    margin: 0.5vh auto;
  }
  .submitReportForm__time-line-cont {
    width: $mobile-width;
  }
  .submitForm__validation-cont {
    width: $mobile-width;
  }
  .submitForm__background-cont {
    width: $mobile-width;
    margin: 2vh auto 0.5vh;
  }
  .submitReportForm__simpleRep-cont {
    width: $mobile-width;
  }
}

</style>
