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

    <h5>{{ $t('substances') }}</h5>
    <ul class="substance-full-data-list">
      <li v-for="sub in report.d.substances" :key="sub.timeSecond">
        <div class="grid"></div>
        <SubstanceItemView
          timeFormat="precise"
          :modelValue="sub"
        />
      </li>
    </ul>

    <h5>{{ $t('background') }}</h5>
    <p class="m-0">
      {{  report.d.background }}
    </p>

    <h5>{{ $t('timeline') }}</h5>
    <ul class="substance-full-data-list">
      <li
        v-for="tl in report.d.timeLineReport"
        :key="tl.timeSecond"
        :title="formatReportTime(tl.timeSecond)">
        <p class="m-0">
          <span v-if="report.d.timeLineReport.length === 1 && tl.timeSecond
           || report.d.timeLineReport.length !== 1" :title="$t('time')">
            {{ formatReportTime(tl.timeSecond) }}
          </span><br/>
          {{ tl.report }}<br/>
          <br/>
        </p>
      </li>
    </ul>
    <h5>{{ $t('author_info') }}</h5>
    <address>
      {{ $t('nick') }}: {{ report?.signature.user.nick }}
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
import { getter } from './InputMaskTime.vue';
import SubstanceItemView from './SubstanceItemView.vue';

export default defineComponent({
  name: 'ReportPage',
  components: { SubstanceItemView },
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
    formatReportTime(timeSecond: number) {
      return getter.call({
        modelValue: timeSecond,
        timeFormat: 'long',
        prefix: '+T',
      })
    },
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
.substance-full-data-list {
  display: flex;
  flex-wrap: wrap;
  li {
    display: flex;
    width: 100%;
  }
}
</style>
