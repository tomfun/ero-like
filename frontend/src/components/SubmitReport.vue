<template>
  <h1>{{ $t('submit_page_title') }}</h1>
  <Message severity="warn">
    Only registered users can submit reports
    <router-link :to="{ name: 'UserRegistration' }">register</router-link>
  </Message>
  <Message severity="info">
    You can choose either a "simple" report to post with a single block of description,
    or the "timelined" one with time sections each with its own description.
  </Message>
  <TabView v-on:tab-change="handleTabChange">
    <TabPanel header="Simple">
      <Button
         v-if="isDev"
         label="Autofill"
         @click="handleFormFill"
      />
      <div class="tab-wrapper">
        <div class="formgrid grid">
          <div class="field col-12 lg:col">
            <div class="p-float-label">
              <InputText class="w-full" :id="id('title')"
                         v-model="reportData.title" aria-describedby="title-help" />
              <label :for="id('title')">Title</label>
            </div>
            <small :id="id('title-help')">Enter a title the best describes your journey.</small>
          </div>
          <div class="field col-fixed min-w-min md:w-16rem">
            <div class="p-float-label">
              <Calendar v-model="dateTimestampDate"
                        :dateFormat="dateFormatShort"
                        :placeholder="dateFormatShort"
                        :id="id('dateTimestampDate')"
                        aria-describedby="title-help" />
              <label :for="id('dateTimestampDate')">Date</label>
            </div>
            <small :id="id('dateTimestampDate-help')">Enter date of your journey.</small>
          </div>
        </div>
        <SubstanceList
          v-model="reportData.substances"
        />
        <div>
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
      <div class="tab-wrapper">
        <div class="grid grid-nogutter">
          <div class="field col-9">
            <span class="p-float-label">
              <InputText class="col-12" :id="id('title')"
                         v-model="reportData.title" aria-describedby="title-help" />
              <label :for="id('title')">Title</label>
            </span>
            <small :id="id('title-help')">Enter a title the best describes your journey.</small>
          </div>
          <div class="field col-3">
            <span class="p-float-label">
              <Calendar v-model="dateTimestampDate"
                        :dateFormat="dateFormatShort"
                        :placeholder="dateFormatShort"
                        :id="id('dateTimestampDate')"
                        aria-describedby="title-help" />
              <label :for="id('dateTimestampDate')">Date</label>
            </span>
            <small :id="id('dateTimestampDate-help')">Enter date of your journey.</small>
          </div>
        </div>
        <SubstanceList
          v-model="reportData.substances"
        />
        <TimeLineReportForm v-bind:item="stagedReport" @update:item="updateRepForm" v-if="stagedRep"/>
        <Button
          v-if="!stagedRep"
          v-on:click="handleAddTimeLineReport"
          :disabled="addReportButtonDisable">
          Add time line form
        </Button>
      </div>
    </TabPanel>
  </TabView>
  <div>
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
  <div>
    <Button
      :disabled="validationButtonDisable"
      v-on:click="handleValidation">Validate report</Button>
    <template v-if="step === 'validating' || step === 'signing' ">
      <Message severity="error" v-for="(error, i) in errors" :key="i">
        {{ error }}
      </Message>
      <Message severity="success" key="success" v-if="!errors.length">
        Your report is submitted successfully!
      </Message>
    </template>
    <div>
      <Panel header="Report signature" toggleable :collapsed="step !== 'signing'">
      <p class="m-0">
          To sign your validated report, first select the user you want to sign the report with.
        </p>
        <p class="m-0">List all users:</p>
        <Textarea
          contenteditable="false"
          rows="1"
          class="copy-paste"
          value="gpg --list-keys"
          auto-resize
          disabled
        />
        <p class="m-0"> Paste in your local CMD the next code replacing $user with your
          value:</p>
        <Textarea
          contenteditable="false"
          rows="1"
          class="copy-paste"
          :value="`echo '${validJson.replace(/'/g, `'\\''`)}' | gpg --clear-sign --disable-signer-uid --local-user `"
          auto-resize
          disabled
        />
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
      <Button class="submitReportForm__add-sub-but" @click="submit"
              :disabled="!clearSignArmored.length">Submit
      </Button>
      <template v-if="step === 'submitting'">
        <Message severity="error" v-for="(error, i) in errors" :key="i">
          {{ error }}
        </Message>
        <Message severity="success" key="success" v-if="!errors.length">
          Your report is submitted successfully!
        </Message>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import type { Substance } from '../services/api';
import { defineComponent } from 'vue';
import { useFormat } from '../format.js/useFormat';
import { BadRequestError, reportDataValidation, reportSubmit } from '../services/api';
import TimeLineReportForm from './TimeLineReportForm.vue';
import SubstanceList from './SubstanceList.vue';
import TabView, { type TabViewClickEvent } from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

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

const STORAGE_KEY = 'report-alpha1';

export default defineComponent({
  name: 'SubmitReport',
  components: {
    TimeLineReportForm,
    SubstanceList,
    TabPanel,
    TabView,
  },
  setup() {
    const { dateFormatShort } = useFormat();
    return {
      dateFormatShort,
    };
  },
  mounted() {
    this.handleAddTimeLineReport();
  },
  data() {
    let storedReport: ReportData|null = null;
    try {
      storedReport = localStorage && JSON.parse(localStorage.getItem(STORAGE_KEY) as string) || null;
    } catch (e) {
      // ignore
    }
    return {
      uid: Math.random().toString(27).slice(2),
      isDev: import.meta.env.DEV,
      reportData: storedReport || {
        substances: [],
        timeLineReport: [],
        background: '',
        dateTimestamp: Math.round(Date.now() / 10000) * 10,
        title: '',
      } as ReportData,
      stagedSubstance: {} as Substance,
      staged: true,
      stagedReport: {} as TimeLineReport,
      stagedRep: false,
      simpleReportText: '',
      simple: true,
      errors: [] as string[],
      step: 'entering' as ('entering' | 'validating' | 'submitting' | 'signing'),
      validJson: '',
      clearSignArmored: '',
    };
  },
  computed: {
    dateTimestampDate: {
      get(): Date {
        return new Date(this.reportData.dateTimestamp * 1000)
      },
      set(v: Date) {
        this.reportData.dateTimestamp = Math.floor(v.getTime() / 10000) * 10;
      },
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
        surePercent: 30,
      };
      this.stagedSubstance = substance;

      this.simpleReportText = 'Repppoopoo'
      this.reportData.title = 'Title';
      this.reportData.background = 'Backgroundd';
      this.reportData.dateTimestamp = Math.round(Date.now() / 10000) * 10;
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
      this.step = 'validating';
      try {
        this.validJson = await reportDataValidation({
          substances: [...this.reportData.substances],
          timeLineReport: this.simple ? [{
            timeSecond: 0,
            report: this.simpleReportText,
          }] : [...this.reportData.timeLineReport],
          title: this.reportData.title,
          background: this.reportData.background,
          dateTimestamp: this.reportData.dateTimestamp,
        })
        this.errors.length = 0;
        this.step = 'signing'
      } catch (e) {
        if (e instanceof BadRequestError) {
          this.errors = e.errors;
        } else {
          this.errors = [(e as Error).message];
        }
      }
    },
    async submit() {
      this.step = 'submitting';
      try {
        this.validJson = await reportSubmit(this.clearSignArmored)
        this.errors.length = 0;
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
          // ignore
        }
      } catch (e) {
        if (e instanceof BadRequestError) {
          this.errors = e.errors;
        } else {
          this.errors = [(e as Error).message];
        }
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
  },
  watch: {
    reportData: {
      deep: true,
      handler(reportData) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reportData))
        } catch (e) {
          // ignore
        }
      }
    }
  }
});
</script>

<style scoped lang="scss">
.tab-wrapper {
  padding-top: 2em;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
}

.copy-paste .p-inputtextarea {
  width: 100%;
  opacity: 0.94;
}

</style>
