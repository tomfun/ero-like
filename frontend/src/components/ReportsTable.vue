<template>
  <div style="height: .5em">
  <ProgressBar
    v-if="isLoading"
    mode="indeterminate"
    style="height: .5em"
  />
  </div>
  <DataTable :value="reports" :lazy="true"  v-model:filters="filters"
    :paginator="true" :resizableColumns="true" :rows="pagination.pageSize"
    :totalRecords="pagination.itemsTotal" :rowsPerPageOptions="[10,20,50,100]"
    :paginatorTemplate="pag" @page="onPage($event)" filterDisplay="row"
    @filter="onFilter()"
    :globalFilterFields="[
      'user.nick', 'd.title', 'd.substances.*.namePsychonautWikiOrg', 'd.dateTimestamp']"
    >
    <Column field="user.nick" filter-field="user.nick" header="Nick" style="min-width: 14rem"
            filterMatchMode="startsWith"
            :filterMatchModeOptions="configFilterMatchModeOptions.text.slice(0, 2)"
            ref="nick">
      <template #filter="{filterModel,filterCallback}">
        <AutoComplete
          placeholder="Search by nick"
          v-model="filterModel.value"
          :suggestions="(filterModel as ModelReportFilters['user.nick']).suggestions"
          @update:modelValue="filterCallback()"
          @keydown.enter="filterCallback()"
          @complete="onComplete('user.nick', (filterModel as ModelReportFilters['user.nick']), $event)"
        />
      </template>
      <template #body="{data}">
        <span :title="formatDate(new Date(data.user.createdAt))">
          {{ data.user.nick }}
        </span>
      </template>
    </Column>
    <Column field="d.title" filterField="d.title" header="Title" style="min-width: 16rem"
            :filterMatchModeOptions="configFilterMatchModeOptions.text"
            ref="title">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text"
                   v-model="filterModel.value"
                   @keydown.enter="filterCallback()"
                   @update:modelValue="filterCallback()"
                   class="p-column-filter" placeholder="Search by title"/>
      </template>
    </Column>
    <Column field="d.substances.*.namePsychonautWikiOrg"
            filterField="d.substances.*.namePsychonautWikiOrg"
            header="Substances"
            filterMatchMode="contains"
            :showFilterMenu="false"
            ref="substances">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value"
                   @update:modelValue="filterCallback()"
                   @keydown.enter="filterCallback()"
                   class="p-column-filter"
                   placeholder="Search by canonical name"/>
      </template>
      <template #body="{data}">
        <ul class="substance-list" :title="maxSubstanceTimeSecond">
          <template v-for="(s, i) in data.d.substances" :key="i">
            <li class="arrow" :title="Math.round(s.timeSecond / 60) + ' minutes'">
            <div>
              <hr
                :style="`width: ${Math.round(100 * s.timeSecond / maxSubstanceTimeSecond)}%`"
              />
            </div>
            </li>
            <li :title="Math.round(s.timeSecond / 60) + ' minutes'">
            +<span>{{s.namePsychonautWikiOrg}}</span> {{s.dose}}<small>{{s.doseUnit}}</small>
            </li>
          </template>
        </ul>
      </template>
    </Column>
    <Column filterField="date"
            header="Date"
            :filterMatchModeOptions="configFilterMatchModeOptions.date"
            ref="date">
      <template #filter="{filterModel,filterCallback}">
        <Calendar v-model="filterModel.value"
                  @update:modelValue="filterCallback()"
                  dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
      </template>
      <template #body="{data}">
        {{ formatDate(data.d.dateTimestamp) }}
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { debounce, get } from 'lodash-es';
import type {
  State as ReportsState,
} from '../store/reports';
import type { Pagination } from '../store/reports';
import {
  IS_LOADING, PAGINATION, REPORTS, REPORTS_MODULE,
} from '../store/reports';
import { FETCH_REPORTS } from '../store/reports/actions';
import type { ReportFilters, Report } from '../services/api';
import pipe from '../services/api.converter';

type FetchParams = {
  page: number;
  pageSize: number;
  filters: ReportFilters;
};

type ModelReportFilters = ReportFilters & {
  'date': {
    value: null | Date;
    matchMode: 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter';
  };
  'user.nick': {
    suggestions: string[];
  };
};

type ReportsTableThis = {
  pagination: Pagination;
  reports: Report[];
};

export default defineComponent({
  name: 'ReportsTable',
  components: { DataTable, Column },
  data() {
    const filters: ModelReportFilters = {
      'user.nick': {
        value: null,
        suggestions: [],
        matchMode: 'startsWith',
      },
      'd.dateTimestamp': {
        value: null,
        matchMode: 'equals',
      },
      date: {
        value: null,
        matchMode: 'dateAfter',
      },
      'd.title': {
        value: null,
        matchMode: 'contains',
      },
      'd.substances.*.namePsychonautWikiOrg': {
        value: null,
        matchMode: 'contains',
      },
    };
    return {
      isDebouncedFetch: false,
      fetchParams: {
        page: 0,
        pageSize: 10,
        filters,
      } as FetchParams,
      pag: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
      fetchDebounced: debounce(
        () => {
          (this as any).isDebouncedFetch = false;
          return this.fetchReports(this.fetchParams);
        },
        150, {
          maxWait: 5000,
        },
      ),
      filters,
      configFilterMatchModeOptions: {
        text: [
          { value: 'equals', label: 'Equals' },
          { value: 'startsWith', label: 'Starts With' },
          { value: 'contains', label: 'Contains' },
          { value: 'endsWith', label: 'Ends With' },
        ],
        date: [
          { value: 'dateBefore', label: 'Date Before' },
          { value: 'dateAfter', label: 'Date After' },
        ],
      },
    };
  },
  methods: {
    ...mapActions(REPORTS_MODULE, {
      fetchReports: FETCH_REPORTS,
    }),
    async fetchWith(fetchParams: Partial<FetchParams>) {
      this.fetchParams = { ...this.fetchParams, ...fetchParams };
      this.isDebouncedFetch = true;
      return this.fetchDebounced();
    },
    async onPage({ page, rows: pageSize }: {page: number; rows: number}) {
      return this.fetchWith({ page, pageSize });
    },
    onFilter() {
      const { date } = this.filters;
      const filters = { ...this.filters } as Omit<ModelReportFilters, 'date'> & Partial<ModelReportFilters>;
      delete filters.date;
      if (date.value) {
        filters['d.dateTimestamp'].value = +date.value / 1000;
        filters['d.dateTimestamp'].matchMode = date.matchMode === 'dateBefore' ? 'lt' : 'gt';
      } else {
        filters['d.dateTimestamp'].value = null;
      }
      this.fetchWith({ ...this.fetchParams, filters });
    },
    onRouteUpdate() {
      if (this.getCurrentDesiredRoute() === this.$route.fullPath) {
        return;
      }
      const convert = (operator: string, values: Record<string, number | string>) => ({
        value: values[operator],
        matchMode: operator,
      });
      const routerToComponentMap = {
        'd.substances.*.namePsychonautWikiOrg': {
          key: ['d', 'substances.*.namePsychonautWikiOrg'],
          convert,
        },
        date: {
          key: ['d', 'dateTimestamp'],
          convert(operator: string, values: Record<string, number | string>) {
            const value = new Date(1000 * +values[operator]);
            if (operator === 'lt') {
              return {
                value,
                matchMode: 'dateBefore',
              };
            } if (operator === 'gt') {
              return {
                value,
                matchMode: 'dateAfter',
              };
            }
            return undefined;
          },
        },
      };

      const query = (this.$route.fullPath.match(/\?(.+)$/) || ['', ''])[1];
      const filters = pipe.parse(query);
      (Object.keys(this.filters) as Array<keyof ModelReportFilters>).forEach((key) => {
        let field;
        let convertToPair: (operator: string, values: Record<string, number | string>) => ({
          value: number | string | Date | null;
          matchMode: string;
        } | undefined) = convert;
        if (key in routerToComponentMap) {
          const transform = routerToComponentMap[key as keyof typeof routerToComponentMap];
          field = get(filters, transform.key);
          convertToPair = transform.convert;
        } else {
          field = get(filters, key);
        }
        if (!field) {
          this.filters[key].value = null;
          return;
        }
        const { filters: values } = (field as { filters: Record<string, number | string> });
        Object.keys(values).find((operator) => {
          const pair = convertToPair(operator, values);
          if (!pair) {
            return false;
          }
          Object.assign(this.filters[key], pair);
          return true;
        });
      });
      this.onFilter();
      this.fetchDebounced.flush();
    },
    onApiFinalResponse() {
      if (this.isLoading || this.isDebouncedFetch) {
        setTimeout(this.onApiFinalResponse, 500, this);
        return;
      }
      this.$router.push(this.getCurrentDesiredRoute());
    },
    getCurrentDesiredRoute() {
      return `${this.$router.currentRoute.value.path}?${this.pagination.encodedQuery}`;
    },
    onComplete(
      path: string,
      filter: ReportFilters['user.nick'] & { suggestions: string[] },
      { query }: { query: string },
    ) {
      filter.suggestions = Object
        .values(this.data)
        .map((r) => get(r, path))
        .filter((f) => f.startsWith(query));
    },
    formatDate(value: number | Date) {
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
      isLoading: IS_LOADING,
      pagination: PAGINATION,
      data: REPORTS,
    }),
    ...mapState(REPORTS_MODULE, {
      reports(state: unknown): Report[] {
        const { data } = state as ReportsState;
        return (this as unknown as ReportsTableThis).pagination.viewIds.map((id) => data[id]);
      },
      maxSubstanceTimeSecond() {
        const { reports } = (this as unknown as ReportsTableThis);
        // const { reports } = (this as unknown as { reports: Report[] });
        return reports.reduce((max, r) => {
          const times = r.d.substances
            .map((s) => s.timeSecond)
            .filter((t) => !Number.isNaN(t) && Number.isFinite(t));
            //  because tslib update
            // eslint-disable-next-line prefer-spread
          const localMax = Math.max.apply(Math, times);
          return Math.max(
            max,
            localMax,
          );
        },
        1);
      },
      encodedQuery(): string {
        return (this as unknown as ReportsTableThis).pagination.encodedQuery;
      },
    }),
  },
  watch: {
    encodedQuery() {
      this.onApiFinalResponse();
    },
  },
  beforeMount() {
    this.onRouteUpdate();
    this.$watch(
      () => this.$route.fullPath,
      () => {
        this.onRouteUpdate();
      },
    );
  },
});

</script>
<style scoped lang="scss">
.substance-list {
  li.arrow {
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    div {
      hr {
        margin: 0 0;
        padding: 1px 0;
        box-sizing: border-box;
        border-top: 2px solid grey;
        color: #e8e8e8;
        background-color: #e8e8e8;
        border-bottom: 2px solid #fff;
      }
    }
  }
  border-left: 2px solid grey;
  background-color: #f1f1f1;
  list-style-type: none;
  padding: 4px 12px;
}
</style>
