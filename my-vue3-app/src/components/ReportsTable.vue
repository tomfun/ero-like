<template>
  <DataTable :value="reports" :lazy="true"  v-model:filters="filters"
    :paginator="true" :resizableColumns="true" :rows="pagination.pageSize"
    :totalRecords="pagination.itemsTotal" :rowsPerPageOptions="[10,20,50,100]"
    :paginatorTemplate="pag" @page="onPage($event)" filterDisplay="row"
    @filter="onFilter($event)" :loading="isLoading"
    :globalFilterFields="[
      'user.nick', 'd.title', 'd.substances.*.namePsychonautWikiOrg', 'd.dateTimestamp']"
    >
    <Column field="user.nick" filter-field="user.nick" header="Nick" style="min-width: 14rem"
            ref="nick">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
                   class="p-column-filter" placeholder="Search by nick"/>
      </template>
      <template #body="{data}">
        <span :title="(new Date(data.user.createdAt)).toLocaleDateString()">
          {{ data.user.nick }}
        </span>
      </template>
    </Column>
    <Column field="d.title" filter-field="d.title" header="Title" style="min-width: 16rem"
            ref="title">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
        class="p-column-filter" placeholder="Search by title"/>
      </template>
    </Column>
    <Column field="d.substances.*.namePsychonautWikiOrg"
            filter-field="d.substances.*.namePsychonautWikiOrg"
            header="Substances"
            ref="substances">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
                   class="p-column-filter" placeholder="Search by canonical name"/>
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
    <Column field="d.dateTimestamp" filter-field="d.dateTimestamp"
            dataType="date"
            header="Date"
            ref="date">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
                   class="p-column-filter" placeholder="Search by title"/>
      </template>
      <template #body="{data}">
        {{(new Date(data.d.dateTimestamp * 1000)).toLocaleDateString()}}
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts">
import DataTable from 'primevue/datatable';
import {
  IS_LOADING, PAGINATION, REPORTS_MODULE, State as ReportsState,
} from '@/store/reports';
import { FETCH_REPORTS } from '@/store/reports/actions';
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import Column from 'primevue/column';
import { ReportFilters, Report } from '@/services/api';
import { debounce } from 'lodash-es';

type FetchParams = {
  page: number;
  pageSize: number;
  filters: ReportFilters;
};

export default defineComponent({
  name: 'ReportsTable',
  components: { DataTable, Column },
  data() {
    const filters: ReportFilters = {
      'user.nick': {
        value: null,
        matchMode: 'equals',
      },
      'd.dateTimestamp': {
        value: null,
        matchMode: 'equals',
      },
      'd.title': {
        value: null,
        matchMode: 'equals',
      },
      'd.substances.*.namePsychonautWikiOrg': {
        value: null,
        matchMode: 'equals',
      },
    };
    return {
      fetchParams: {
        page: 0,
        pageSize: 10,
        filters,
      } as FetchParams,
      pag: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
      fetchDebounced: debounce(
        () => this.fetchReports(this.fetchParams),
        150, {
          maxWait: 5000,
        },
      ),
      filters,
    };
  },
  methods: {
    ...mapActions(REPORTS_MODULE, {
      fetchReports: FETCH_REPORTS,
    }),
    async fetchWith(fetchParams: Partial<FetchParams>) {
      this.fetchParams = { ...this.fetchParams, ...fetchParams };
      return this.fetchDebounced();
    },
    async onPage({ page, rows: pageSize }: {page: number; rows: number}) {
      return this.fetchWith({ page, pageSize });
    },
    onFilter() {
      this.fetchWith({ ...this.fetchParams, filters: { ...this.filters } });
    },
  },
  computed: {
    ...mapState(REPORTS_MODULE, {
      isLoading: IS_LOADING,
      pagination: PAGINATION,
    }),
    ...mapState(REPORTS_MODULE, {
      reports(state: ReportsState): Report[] {
        const { data } = state;
        return state.pagination.viewIds.map((id) => data[id]);
      },
      maxSubstanceTimeSecond() {
        const { reports } = (this as unknown as { reports: Report[] });
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
    }),
  },
  mounted() {
    this.fetchWith({});
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
