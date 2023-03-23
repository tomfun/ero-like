<template>
  <DataTable :value="reports" :lazy="true"  v-model:filters="filters"
    :paginator="true" :resizableColumns="true" :rows="pagination.pageSize"
    :totalRecords="pagination.itemsTotal" :rowsPerPageOptions="[10,20,50,100]"
    :paginatorTemplate="pag" @page="onPage($event)" filterDisplay="row"
    @filter="onFilter($event)" :loading="isLoading"
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
import {
  IS_LOADING, PAGINATION, REPORTS_MODULE, URL, State as ReportsState,
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
  filters: {
    nick: {
      value: string|undefined;
      matchMode: string;
    };
    title: {
      value: string|undefined;
      matchMode: string;
    };
  };
};

export default defineComponent({
  name: 'reportsTab',
  components: { DataTable, Column },
  data() {
    return {
      urlTab: '/reportsTab',
      fetchParams: {
        page: 0,
        pageSize: 10,
        filters: {
          nick: {
            value: undefined,
            matchMode: 'equals',
          },
          title: {
            value: undefined,
            matchMode: 'equals',
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
        nick: { value: undefined, matchMode: 'equals' },
        title: { value: undefined, matchMode: 'equals' },
      } as FetchParams['filters'],
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
      return this.fetchWith({ page, pageSize }); // check if works with filters
    },
    onFilter() {
      if (this.filters.nick.value === null) {
        this.fetchParams.filters.nick.value = undefined;
        this.filters.nick.value = undefined;
      }
      if (this.filters.title.value === null) {
        this.fetchParams.filters.title.value = undefined;
        this.filters.title.value = undefined;
      }
      this.fetchWith({ ...this.fetchParams, filters: { ...this.filters } });
    },
  },
  computed: {
    ...mapState(REPORTS_MODULE, {
      isLoading: IS_LOADING,
      pagination: PAGINATION,
      url: URL,
    }),
    ...mapState(REPORTS_MODULE, {
      reports(state: ReportsState): Report[] {
        const { data } = state;
        return state.pagination.viewIds.map((id) => data[id]);
      },
    }),
  },
  watch: {
    url() {
      const template = `${this.urlTab}?${this.url}`;
      this.$router.addRoute({ path: template, component: this, name: this.urlTab });
      this.$router.replace(`${template}`);
    },
  },
  beforeMount() {
    Object.keys(this.$route.query).forEach((key) => {
      if (key.includes('[') && key.includes(']')) {
        // eslint-disable-next-line no-useless-escape
        const filterTypeRegEx = /\[\w+\]/;
        const filterTypeMatchArr = key.match(filterTypeRegEx);
        const filtersTypesArray = filterTypeMatchArr?.map((filter) => filter.replace('[', '').replace(']', ''));
        let filterName = '';
        if (filterTypeMatchArr !== null) {
          filterName = key.replace(filterTypeMatchArr[0], '');
        }
        if (filtersTypesArray !== undefined) {
          if (filterName === 'nick' || filterName === 'title') {
            const val = this.$route.query[key];
            // eslint-disable-next-line prefer-destructuring
            this.fetchParams.filters[filterName].matchMode = filtersTypesArray[0];
            // eslint-disable-next-line prefer-destructuring
            this.filters[filterName].matchMode = filtersTypesArray[0];
            if (typeof val === 'string') {
              this.fetchParams.filters[filterName].value = val;
              this.filters[filterName].value = val;
            }
          }
        }
      }
    });
  },
  mounted() {
    if (this.url.length > 0 && this.$router.hasRoute(this.urlTab)) {
      this.$router.replace(`${this.urlTab}?${this.url}`);
      this.filters.nick.value = this.pagination.filters.nick.value;
      this.filters.nick.matchMode = this.pagination.filters.nick.matchMode;
      this.filters.title.value = this.pagination.filters.title.value;
      this.filters.title.matchMode = this.pagination.filters.title.matchMode;
    } else {
      this.fetchWith({});
    }
  },
});

</script>
