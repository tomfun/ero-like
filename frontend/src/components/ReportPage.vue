<template>
  <div style="height: .5em">
  <ProgressBar
    v-if="isLoading"
    mode="indeterminate"
    style="height: .5em"
  />
  </div>
  <template v-if="report?.d">
    <h3>{{ report.d.title }}</h3>
    <Panel header="Substances" class="substance-cont" toggleable :collapsed="false">
      <ul class="substance-full-data-list">
        <li v-for="sub in report.d.substances" :key="sub">
          <Panel :header="sub.namePsychonautWikiOrg" toggleable :collapsed="false">
            <p class="m-0">
              Dose: {{ sub.dose }}<br/>
              Dose Unit: {{ sub.doseUnit }} <br/>
              Time: {{ sub.timeSecond }}<br/>
<!--              Quality percent:{{ sub.surePercent }}<br/>-->
              Name on Psychonaut Wiki Org: {{ sub.namePsychonautWikiOrg }}<br/>
              Route of administration: {{ sub.routeOfAdministration }}<br/>
            </p>
          </Panel>
        </li>
      </ul>
    </Panel>
    <Panel header="Author Info" class="substance-cont" toggleable :collapsed="false">
      <p class="m-0">
        Nick: {{  report.signature.user.nick }}<br/>
      </p>
    </Panel>
    <Panel header="Background" class="substance-cont" toggleable :collapsed="false">
      <p class="m-0">
        {{  report.d.background }}
      </p>
    </Panel>
    <Panel header="Timeline" class="substance-cont" toggleable :collapsed="false">
      <ul class="substance-full-data-list">
        <li v-for="tl in report.d.timeLineReport" :key="tl">
          <Panel :header="tl.timeSecond.toString()" toggleable :collapsed="false">
            <p class="m-0">
              Time: {{ tl.timeSecond }}<br/>
              Description: {{ tl.report }}<br/>
            </p>
          </Panel>
        </li>
      </ul>
    </Panel>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import type {
  State as ReportsState,
} from '../store/reports';
import {
  REPORTS_MODULE,
} from '../store/reports';
import { FETCH_REPORT } from '../store/reports/actions';
import type { Report } from '../services/api';

export default defineComponent({
  name: 'ReportPage',
  data() {
    return { loading: 0 };
  },
  methods: {
    ...mapActions(REPORTS_MODULE, {
      fetchReport: FETCH_REPORT,
    }),
    onRouteUpdate() {
      this.fetch(this.reportId);
    },
    async fetch(id: string) {
      this.loading++;
      try {
        await this.fetchReport(id);
      } finally {
        this.loading--;
      }
    },
    formatDate(value: number | Date) {
      // todo: localization
      const date = (typeof value === 'number' ? new Date(value * 1000) : value);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
  },
  computed: {
    ...mapState(REPORTS_MODULE, {
      report(state: unknown): Report {
        const { data } = state as ReportsState;
        return data[(this as any).reportId] || ({} as Report);
      },
    }),
    isLoading(): boolean {
      return this.loading !== 0;
    },
    reportId() {
      return this.$route.params.id as string;
    },
  },
  watch: {
    '$route.fullPath': {
      immediate: true,
      handler() {
        this.onRouteUpdate();
      },
    },
  },
});

</script>
<style scoped lang="scss">

</style>
