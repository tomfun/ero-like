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
    </Column>
    <Column field="d.title" filter-field="d.title" header="Title" style="min-width: 14rem"
            ref="title">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
        class="p-column-filter" placeholder="Search by title"/>
      </template>
    </Column>
    <Column field="d.substances.*.namePsychonautWikiOrg"
            filter-field="d.substances_namePsychonautWikiOrg"
            header="Substances"
            style="min-width: 14rem"
            ref="substances">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
                   class="p-column-filter" placeholder="Search by title"/>
      </template>
      <template #body="{data}">
        {{ data
        .d.substances.map((s) => `${s.namePsychonautWikiOrg} ${s.dose}${s.doseUnit}`).join(', ') }}
      </template>
    </Column>
    <Column field="d.dateTimestamp" filter-field="d.dateTimestamp"
            dataType="date"
            header="Date"
            style="min-width: 14rem"
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
import { Report } from '@/services/api';
import { debounce } from 'lodash-es';

type FetchParams = {
  page: number;
  pageSize: number;
  filters: Record<'user.nick' | 'd.title' | 'd.substances.*.namePsychonautWikiOrg' | 'd.substances_namePsychonautWikiOrg', {
      value: string|undefined;
      matchMode: string;
    }> | Record<'d.dateTimestamp', {
    value: number|undefined;
    matchMode: string;
  }>;
};

export default defineComponent({
  name: 'ReportsTable',
  components: { DataTable, Column },
  data() {
    const filters: FetchParams['filters'] = {
      'user.nick': {
        value: undefined,
        matchMode: 'equals',
      },
      'd.dateTimestamp': {
        value: undefined,
        matchMode: 'equals',
      },
      'd.title': {
        value: undefined,
        matchMode: 'equals',
      },
      'd.substances.*.namePsychonautWikiOrg': {
        value: undefined,
        matchMode: 'equals',
      },
      'd.substances_namePsychonautWikiOrg': {
        value: undefined,
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
    }),
  },
  mounted() {
    this.fetchWith({});
  },
});

</script>
