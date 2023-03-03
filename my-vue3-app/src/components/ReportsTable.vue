<template>
  <p>{{ isLoading }}</p>
  <DataTable :value="reports" :lazy="true"  v-model:filters="filters"
    :paginator="true" :rows="pagination.pageSize"
    :totalRecords="pagination.itemsTotal" :rowsPerPageOptions="[10,20,50,100]"
    :paginatorTemplate="pag" @page="onPage($event)" filterDisplay="row"
    @filter="onFilter($event)"
    :globalFilterFields="['nick', 'title']"
    >
    <Column field="nick" header="Nick" style="min-width: 14rem" ref="nick">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
        class="p-column-filter" placeholder="Search by nick"/>
      </template>
      <template #body="{data}">
        {{data.nick}}
      </template>
    </Column>
    <Column field="title" header="Title" style="min-width: 14rem" ref="title">
      <template #filter="{filterModel,filterCallback}">
        <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()"
        class="p-column-filter" placeholder="Search by title"/>
      </template>
      <template #body="{data}">
        {{data.title}}
      </template>
    </Column>
    <Column field="id" header="ID" style="min-width: 14rem">
      <template #body="{data}">
        {{data.id}}
      </template>
    </Column>
    <Column field="gpgSignature" header="GPG Signature" style="min-width: 14rem">
      <template #body="{data}">
        {{data.gpgSignature}}
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts">
import DataTable from 'primevue/datatable';
import { IS_LOADING, PAGINATION, REPORTS_MODULE } from '@/store/reports';
import { FETCH_REPORTS } from '@/store/reports/actions';
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'vuex';
import Column from 'primevue/column';
import { Report } from '@/services/api';
import { debounce } from 'lodash-es';

type FetchParams = {
  page: number;
  pageSize: number;
  filters: {
    nick: {
      value: string|undefined;
      type: string;
    };
    title: {
      value: string|undefined;
      type: string;
    };
  };
};

export default defineComponent({
  name: 'ReportsTable',
  components: { DataTable, Column },
  data() {
    return {
      fetchParams: {
        page: 0,
        pageSize: 10,
        filters: {
          nick: {
            value: undefined,
            type: 'equal',
          },
          title: {
            value: undefined,
            type: 'equal',
          },
        },
      } as FetchParams,
      singleReport: {
        id: '',
        title: '',
        nick: '',
        gpgSignature: 'string',
      } as Report,
      pag: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
      fetchDebounced: debounce(
        () => this.fetchReports(this.fetchParams),
        150, {
          maxWait: 5000,
        },
      ),
      filters: {
        // eslint-disable-next-line quote-props
        'nick': { value: '', matchMode: 'equals' },
        // eslint-disable-next-line quote-props
        'title': { value: '', matchMode: 'equals' },
      },
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
      this.fetchWith({ ...this.fetchParams });
    },
  },
  computed: {
    reports(): Report[] {
      const { data } = this.$store.state[REPORTS_MODULE];
      return this.$store.state[REPORTS_MODULE].pagination.viewIds.map((id) => data[id]);
    },
    ...mapState(REPORTS_MODULE, {
      isLoading: IS_LOADING,
      pagination: PAGINATION,
      // reports: REPORTS, //check callback param
    }),
  },
  mounted() {
    // eslint-disable-next-line no-return-assign
    this.fetchWith({});
  },
});

</script>
