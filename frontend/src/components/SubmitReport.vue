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
  <TabView v-on:tab-change="handleTabChange" :activeIndex="simple ? 0 : 1">
    <TabPanel header="Simple">
      <Button
         v-if="isDev"
         label="Autofill"
         @click="handleFormFill"
      />
      <div class="tab-wrapper">
        <CommonSubmitReport v-model="reportData" :timeFormat="TIME_FORMAT" />
        <div class="float-label-spacing">
          <div class="p-float-label p-float-label-shift">
          <Textarea
            :inputId="id('report')"
            :aria-describedby="id('report-text')"
            class="w-full"
            v-model="reportData.timeLineReport[0].report"
            autoResize
          />
            <label :for="id('timeSecond')">Report text</label>
            <small :id="id('report-text')">Type here you thoughts, feelings, effects, everything
              you consider relevant to describe your experience.</small>
          </div>
        </div>
      </div>
    </TabPanel>
    <TabPanel header="Timelined">
      <div class="tab-wrapper">
        <CommonSubmitReport v-model="reportData" :timeFormat="TIME_FORMAT" />

        <TimeLineReportList
          v-model="reportData.timeLineReport"
          :DynamicComponent="TimeLineReportItem"
        />
      </div>
    </TabPanel>
  </TabView>
  <div class="container-spacing">
    <div class="float-label-spacing">
      <span class="p-float-label">
        <Textarea
          :inputId="id('background')"
          :aria-describedby="id('backgroundHelp')"
          class="w-full"
          v-model="reportData.background"
          autoResize
          >
        </Textarea>
        <label :for="id('background')">Background text</label>
      </span>
      <small :id="id('backgroundHelp')">Tell us about yourself at the moment of the report</small>
    </div>
    <div class="button-wrapper">
      <Button
        :disabled="validationButtonDisable"
        v-on:click="handleValidation">Validate report</Button>
    </div>
    <template v-if="step === 'validating' || step === 'signing' ">
      <Message severity="error" v-for="(error, i) in errors" :key="i">
        {{ error }}
      </Message>
      <Message severity="success" key="success" v-if="!errors.length">
        Your report is submitted successfully!
      </Message>
    </template>
    <Panel header="Report signature" toggleable :collapsed="step !== 'signing'">

    <ContentSignature
      v-if="validJson"
      :content="validJson"
    />

    </Panel>
    <div class="float-label-spacing">
      <div class="p-float-label p-float-label-shift">
        <Textarea
        v-model="clearSignArmored"
        name="clearSignArmored"
        :id="id('clearSignArmored')"
        :aria-describedby="id('clearSignArmoredHelp')"
        cols="66"
        rows="15"
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
        <label :for="id('clearSignArmored')">Signed report:</label>
        <br/>
        <small :id="id('clearSignArmoredHelp')">Paste here your validated and signed report.</small>
      </div>
    </div>
    <div class="button-wrapper">
      <Button @click="submit" :disabled="!clearSignArmored.length">Submit</Button>
    </div>
    <template v-if="step === 'submitting'">
      <Message severity="error" v-for="(error, i) in errors" :key="i">
        {{ error }}
      </Message>
      <Message severity="success" key="success" v-if="!errors.length">
        Your report is submitted successfully!
      </Message>
    </template>
  </div>
</template>

<script lang="ts">
import TabPanel from 'primevue/tabpanel';
import TabView, { type TabViewClickEvent } from 'primevue/tabview';
import { defineComponent } from 'vue';
import type { ReportDataAlpha1, ReportSubstanceAlpha1, ReportTimeLineItemAlpha1 } from '../services/api';
import {
  BadRequestError,
  reportDataValidation,
  reportSubmit
} from '../services/api';
import ContentSignature from './ContentSignature.vue';
import GenericOrderedList from './GenericOrderedList.vue';
import { getter } from './InputMaskTime.vue';
import CommonSubmitReport from './SubmitRepor/CommonSubmitReport.vue';
import SubstanceItem from './SubstanceItem.vue';
import TimeLineReportItem from './TimeLineReportItem.vue';

const STORAGE_KEY = 'report-alpha1';
const TIME_FORMAT = 'short' as const;

const TimeLineReportList = GenericOrderedList as (typeof GenericOrderedList<ReportTimeLineItemAlpha1, typeof TimeLineReportItem>);

export default defineComponent({
  name: 'SubmitReport',
  components: {
    CommonSubmitReport,
    ContentSignature,
    TimeLineReportList,
    TabPanel,
    TabView,
  },
  data() {
    let storedReport: ReportDataAlpha1|null = null;
    try {
      storedReport = localStorage && JSON.parse(localStorage.getItem(STORAGE_KEY) as string) || null;
    } catch (e) {
      // ignore
    }
    const reportData: ReportDataAlpha1 = storedReport || this.newReport();
    return {
      uid: Math.random().toString(27).slice(2),
      isDev: import.meta.env.DEV,
      reportData,
      simple: reportData.timeLineReport.length < 2,
      errors: [] as string[],
      step: 'entering' as ('entering' | 'validating' | 'submitting' | 'signing'),
      validJson: '',
      clearSignArmored: '',
    };
  },
  computed: {
    TIME_FORMAT() {
      return TIME_FORMAT
    },
    SubstanceItem() {
      return SubstanceItem
    },
    TimeLineReportItem() {
      return TimeLineReportItem
    },
    validationButtonDisable() {
      return this.reportData.title.length < 4 || this.reportData.background.length < 4;
    }
  },
  methods: {
    newReport() {
      return {
        substances: [{ timeSecond: 0, namePsychonautWikiOrg: '' } as ReportSubstanceAlpha1],
        timeLineReport: [{ timeSecond: 0, report: '' }],
        background: '',
        dateTimestamp: Math.round(Date.now() / 10000) * 10,
        title: '',
      }
    },
    id(id: string) {
      return this.uid + id.toString();
    },
    handleFormFill() {
      this.reportData.substances = [{
        timeSecond: 0,
        dose: 10,
        doseUnit: 'mg',
        namePsychonautWikiOrg: 'Heroin',
        routeOfAdministration: 'intravenous',
        surePercent: 30,
      }];
      this.reportData.title = 'Title';
      this.reportData.background = 'Backgroundd';
      this.reportData.dateTimestamp = Math.round(Date.now() / 10000) * 10;
    },
    handleTabChange(event: TabViewClickEvent) {
      if (event.index === 1) {
        this.simple = false;
        return;
      }
      this.simple = true;
      const report = this.reportData.timeLineReport
        .map((rep) => (getter.call({
          modelValue: rep.timeSecond,
          timeFormat: TIME_FORMAT,
          prefix: '+T',
        }) + '\n\n' + rep.report).trim())
        .join('\n\n')
        .trim()
        .replace(/^\+T00:00\s*/, '') + ' ';
      this.reportData.timeLineReport[0].report = '...'
      this.reportData.timeLineReport[0].timeSecond = 0
      this.reportData.timeLineReport.length = 1
      // forcibly update report textarea to trigger resize
      this.$nextTick(() => {
        this.reportData.timeLineReport[0].report = report
      })
    },
    async handleValidation() {
      this.step = 'validating';
      try {
        const validJson = await reportDataValidation(this.reportData)
        this.step = 'signing'
        // forcibly update report textarea to trigger resize
        await this.$nextTick()
        this.errors.length = 0;
        this.validJson = validJson
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
        this.reportData = this.newReport()
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
.float-label-spacing {
  padding-top: 1.5em;
  margin-top: 0.5em;
}

.tab-wrapper {
  padding-top: 2em;
}

.container-spacing {
  padding-bottom: 1em;
}

.container-spacing, .tab-wrapper {
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
}

.button-wrapper {
  margin: 0 auto 0.5rem auto;
  text-align: center;
}

</style>
