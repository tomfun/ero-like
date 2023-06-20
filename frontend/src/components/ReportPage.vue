<template>
  <div style="height: .5em">
  <ProgressBar
    v-if="isLoading"
    mode="indeterminate"
    style="height: .5em"
  />
  </div>
  <article v-if="report?.d">
    <h3>{{ report.d.title }}</h3>
    <Panel :header="$t('substances')" class="substance-cont" toggleable :collapsed="false">
      <ul class="substance-full-data-list">
        <li v-for="sub in report.d.substances" :key="sub.timeSecond">
          <Panel :header="sub.namePsychonautWikiOrg" toggleable :collapsed="false">
            <p class="m-0">
              {{ $t('dose') }}: {{ sub.dose }}<br/>
              {{ $t('dose_unit') }}: {{ sub.doseUnit }} <br/>
              {{ $t('time') }}: {{ sub.timeSecond }}<br/>
<!--              {{ $t('quality_percent') }}:{{ sub.surePercent }}<br/>-->
              {{ $t('name_on_pwo') }}: {{ sub.namePsychonautWikiOrg }}<br/>
              {{ $t('route_of_admin') }}: {{ sub.routeOfAdministration }}<br/>
            </p>
          </Panel>
        </li>
      </ul>
    </Panel>
    <Panel :header="$t('author_info')" class="substance-cont" toggleable :collapsed="false">
      <p class="m-0">
        {{ $t('nick') }}: {{  report.signature.user.nick }}<br/>
      </p>
    </Panel>
    <Panel :header="$t('background')" class="substance-cont" toggleable :collapsed="false">
      <p class="m-0">
        {{  report.d.background }}
      </p>
    </Panel>
    <Panel :header="$t('timeline')" class="substance-cont" toggleable :collapsed="false">
      <ul class="substance-full-data-list">
        <li v-for="tl in report.d.timeLineReport" :key="tl.timeSecond">
          <Panel :header="tl.timeSecond.toString()" toggleable :collapsed="false">
            <p class="m-0">
              {{ $t('time') }}: {{ tl.timeSecond }}<br/>
              {{ $t('description') }}: {{ tl.report }}<br/>
            </p>
          </Panel>
        </li>
      </ul>
    </Panel>
    <address>
      {{ report?.signature.user.nick }}
    </address>
    <time itemprop="startDate" :datetime="new Date(report?.d.dateTimestamp * 1000).toISOString()">
      {{ formatDate(report?.d.dateTimestamp) }}
    </time>

  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'vue-meta';
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
  setup () {
    const { meta } = useMeta({
      title: '...',
    })
    return { meta }
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
      const date = (typeof value === 'number' ? new Date(value * 1000) : value);
      return date.toLocaleDateString(this.$locale.locale, {
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
    'report': {
      immediate: true,
      handler() {
        const { report } = this;
        if (!report || !report.d) {
          return;
        }
        const newMeta = {
          title: report?.d?.title,
          og: {
            title: report?.d?.title
          },
          'DC.title': report?.d?.title,
          author: report?.signature.user.nick,
          'DC.creator': report?.signature.user.nick,
          'DCTERMS.creator': report?.signature.user.nick,
          'DCTERMS.date': new Date(report?.d.dateTimestamp * 1000).toISOString(),
          'DCTERMS.dateSubmitted': new Date(report?.createdAt).toISOString(),
          'DCTERMS.created': new Date(report?.signature.signedAt as string).toISOString(),
        };
        Object.assign(this.meta, newMeta)
      },
    },
  },
});

</script>
<style scoped lang="scss">

</style>
