<template>
  <div style="height: 0.5em">
    <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 0.5em" />
  </div>
  <DataTable
    :value="reports"
    :lazy="true"
    v-model:filters="filters"
    :paginator="true"
    :resizableColumns="true"
    :rows="pagination.pageSize"
    :totalRecords="pagination.itemsTotal"
    :rowsPerPageOptions="[10, 20, 50, 100]"
    :paginatorTemplate="pag"
    @page="onPage($event)"
    filterDisplay="row"
    @filter="onFilter()"
    :globalFilterFields="[
      'signature.user.nick',
      'd.title',
      'd.substances.*.namePsychonautWikiOrg',
      'd.dateTimestamp',
    ]"
  >
    <Column
      field="signature.user.nick"
      filter-field="signature.user.nick"
      :header="$t('nick')"
      style="min-width: 14rem"
      filterMatchMode="startsWith"
      :filterMatchModeOptions="configFilterMatchModeOptions.text.slice(0, 2)"
      ref="nick"
    >
      <template #filter="{ filterModel, filterCallback }">
        <AutoComplete
          placeholder="Search by nick"
          v-model="filterModel.value"
          :suggestions="(filterModel as ModelReportFilters['signature.user.nick']).suggestions"
          @update:modelValue="filterCallback()"
          @keydown.enter="filterCallback()"
          @complete="
            onComplete(
              'signature.user.nick',
              filterModel as ModelReportFilters['signature.user.nick'],
              $event,
            )
          "
        />
      </template>
      <template #body="{ data }">
        <span :title="$d(new Date((data as Report).signature.user.createdAt))">
          {{ data.signature.user.nick }}
        </span>
      </template>
    </Column>
    <Column
      field="d.title"
      filterField="d.title"
      :header="$t('title')"
      style="min-width: 16rem"
      :filterMatchModeOptions="configFilterMatchModeOptions.text"
      ref="title"
    >
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          type="text"
          v-model="filterModel.value"
          @keydown.enter="filterCallback()"
          @update:modelValue="filterCallback()"
          class="p-column-filter"
          placeholder="Search by title"
        />
      </template>
      <template #body="{ data }">
        <router-link :to="{ name: 'Report', params: { id: data.id } }">
          <div>{{ data.d.title }}</div>
        </router-link>
      </template>
    </Column>
    <Column
      field="d.substances.*.namePsychonautWikiOrg"
      filterField="d.substances.*.namePsychonautWikiOrg"
      :header="$t('substances')"
      filterMatchMode="contains"
      :showFilterMenu="false"
      ref="substances"
    >
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          type="text"
          v-model="filterModel.value"
          @update:modelValue="filterCallback()"
          @keydown.enter="filterCallback()"
          class="p-column-filter"
          placeholder="Search by canonical name"
        />
      </template>
      <template #body="{ data }">
        <ul class="substance-list" :title="formatReportTime(maxSubstanceTimeSecond)">
          <template v-for="(s, i) in data.d.substances" :key="i">
            <li class="arrow" :title="formatReportTime(s.timeSecond)">
              <div>
                <hr
                  :style="`width: ${Math.round(
                    (100 * s.timeSecond) / maxSubstanceTimeSecond,
                  )}%`"
                />
              </div>
            </li>
            <li :title="formatReportTime(s.timeSecond)">
              +<span>{{ s.namePsychonautWikiOrg }}</span> {{ s.dose
              }}<small>{{ s.doseUnit }}</small>
            </li>
          </template>
        </ul>
      </template>
    </Column>
    <Column
      filterField="date"
      :header="$t('date')"
      :filterMatchModeOptions="configFilterMatchModeOptions.date"
      ref="date"
    >
      <template #filter="{ filterModel, filterCallback }">
        <Calendar
          v-model="filterModel.value"
          @update:modelValue="filterCallback()"
          :dateFormat="dateFormatShort"
          :placeholder="dateFormatShort"
        />
      </template>
      <template #body="{ data }">
        {{ $dx(data.d.dateTimestamp) }}
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { debounce, get } from 'lodash-es'
import { useFormat } from '../format.js/useFormat'
import type { Pagination, Reports } from '../store/reports'
import { IS_LOADING, PAGINATION, REPORTS, REPORTS_MODULE } from '../store/reports'
import { FETCH_REPORTS } from '../store/reports/actions'
import type { ReportFilters, Report } from '../services/api'
import pipe from '../services/api.converter'
import { getter } from './InputMaskTime.vue'

type FetchParams = {
  page: number
  pageSize: number
  filters: ReportFilters
}

type ModelReportFilters = ReportFilters & {
  date: {
    value: null | Date
    matchMode: 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter'
  }
  'signature.user.nick': {
    suggestions: string[]
  }
}

export default defineComponent({
  name: 'ReportsTable',
  components: { DataTable, Column },
  setup() {
    const { dateFormatShort } = useFormat()
    return {
      dateFormatShort,
    }
  },
  data() {
    const filters: ModelReportFilters = {
      'signature.user.nick': {
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
    }
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
          ;(this as any).isDebouncedFetch = false
          return this.fetchReports(this.fetchParams)
        },
        150,
        {
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
    }
  },
  methods: {
    ...mapActions(REPORTS_MODULE, {
      fetchReports: FETCH_REPORTS,
    }),
    formatReportTime(timeSecond: number) {
      return getter.call({
        modelValue: timeSecond,
        timeFormat: 'short',
        prefix: '+T',
      })
    },
    async fetchWith(fetchParams: Partial<FetchParams>) {
      this.fetchParams = { ...this.fetchParams, ...fetchParams }
      this.isDebouncedFetch = true
      return this.fetchDebounced()
    },
    async onPage({ page, rows: pageSize }: { page: number; rows: number }) {
      return this.fetchWith({ page, pageSize })
    },
    onFilter() {
      const { date } = this.filters
      const filters = { ...this.filters } as Omit<ModelReportFilters, 'date'> &
        Partial<ModelReportFilters>
      delete filters.date
      if (date.value) {
        filters['d.dateTimestamp'].value = +date.value / 1000
        filters['d.dateTimestamp'].matchMode =
          date.matchMode === 'dateBefore' ? 'lt' : 'gt'
      } else {
        filters['d.dateTimestamp'].value = null
      }
      this.fetchWith({ ...this.fetchParams, filters })
    },
    onRouteUpdate() {
      if (this.getCurrentDesiredRoute() === this.$route.fullPath) {
        return
      }
      this.setDataFromRouter()
      this.onFilter()
      this.fetchDebounced.flush()
    },
    setDataFromRouter() {
      const convert = (operator: string, values: Record<string, number | string>) => ({
        value: values[operator],
        matchMode: operator,
      })
      const routerToComponentMap = {
        'd.substances.*.namePsychonautWikiOrg': {
          key: ['d', 'substances.*.namePsychonautWikiOrg'],
          convert,
        },
        date: {
          key: ['d', 'dateTimestamp'],
          convert(operator: string, values: Record<string, number | string>) {
            const value = new Date(1000 * +values[operator])
            if (operator === 'lt') {
              return {
                value,
                matchMode: 'dateBefore',
              }
            }
            if (operator === 'gt') {
              return {
                value,
                matchMode: 'dateAfter',
              }
            }
            return undefined
          },
        },
      }

      const query = (this.$route.fullPath.match(/\?(.+)$/) || ['', ''])[1]
      const filters = pipe.parse(query)
      ;(Object.keys(this.filters) as Array<keyof ModelReportFilters>).forEach((key) => {
        let field
        let convertToPair: (
          operator: string,
          values: Record<string, number | string>,
        ) =>
          | {
              value: number | string | Date | null
              matchMode: string
            }
          | undefined = convert
        if (key in routerToComponentMap) {
          const transform = routerToComponentMap[key as keyof typeof routerToComponentMap]
          field = get(filters, transform.key)
          convertToPair = transform.convert
        } else {
          field = get(filters, key)
        }
        if (!field) {
          this.filters[key].value = null
          return
        }
        const { filters: values } = field as { filters: Record<string, number | string> }
        Object.keys(values).find((operator) => {
          const pair = convertToPair(operator, values)
          if (!pair) {
            return false
          }
          Object.assign(this.filters[key], pair)
          return true
        })
      })
    },
    onApiFinalResponse() {
      if (this.isLoading || this.isDebouncedFetch) {
        setTimeout(this.onApiFinalResponse, 500, this)
        return
      }
      this.$router.push(this.getCurrentDesiredRoute())
    },
    getCurrentDesiredRoute() {
      return `${this.$router.currentRoute.value.path}?${this.pagination.encodedQuery}`
    },
    onComplete(
      path: string,
      filter: ReportFilters['signature.user.nick'] & { suggestions: string[] },
      { query }: { query: string },
    ) {
      const suggestions = Object.values(this.data)
        .map((r) => get(r, path))
        .filter((f) => f.startsWith(query))
      filter.suggestions = Array.from(new Set(suggestions))
    },
  },
  computed: {
    isLoading(): boolean {
      return this.$store.state[REPORTS_MODULE][IS_LOADING].isLoading
    },
    data(): Reports {
      return this.$store.state[REPORTS_MODULE][REPORTS]
    },
    pagination(): Pagination {
      return this.$store.state[REPORTS_MODULE][PAGINATION]
    },
    reports(): Report[] {
      const { data } = this.$store.state[REPORTS_MODULE]
      return this.pagination.viewIds.map((id) => data[id])
    },
    maxSubstanceTimeSecond() {
      const { reports } = this
      return reports.reduce((max, r) => {
        const times = r.d.substances
          .map((s) => s.timeSecond)
          .filter((t) => !Number.isNaN(t) && Number.isFinite(t))
        //  because tslib update
        // eslint-disable-next-line prefer-spread
        const localMax = Math.max.apply(Math, times)
        return Math.max(max, localMax)
      }, 1)
    },
    encodedQuery(): string {
      return this.pagination.encodedQuery
    },
  },
  watch: {
    encodedQuery() {
      this.onApiFinalResponse()
    },
    '$route.fullPath'() {
      this.onRouteUpdate()
    },
  },
  beforeMount() {
    this.setDataFromRouter()
    this.onRouteUpdate()
  },
})
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
