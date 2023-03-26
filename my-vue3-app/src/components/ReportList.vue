<template>
  <section class="filters">
    <h1>Filters: </h1>
    <div
      id="{{filter.name}}"
      v-for="(filter, index) in filters"
      v-bind:key="index"
      class="filter-container">
      <div class="field-checkbox">
        <Checkbox
          type="checkbox"
          :binary="true"
          v-model="filter.checked"
          :inputId="'filter_enabler-' + filter.name"
          @change="onFiltersChange"
        />
        &nbsp;
        <label :for="'filter_enabler-' + filter.name">{{filter.name}}</label>
      </div>
      <template v-if="filter.checked">
        <Dropdown
          v-model="filter.filterType"
          :options="filterTypes"
          optionLabel="name"
          optionValue="value"
          @change="onFiltersChange"
        />
        <EqualFilterWidget
          v-if="filter.filterType === 'equal'"
          v-model="filter.inputValue"
          v-bind:key="index"
          v-bind:name="filter.name"
          @update:modelValue="onFiltersChange"
        />
        <StartFilterWidget
          v-if="filter.filterType === 'start'"
          v-model="filter.inputValue"
          v-bind:key="index"
          v-bind:name="filter.name"
          :suggestions="filter.suggestions"
          @complete="onComplete(filter, $event)"
          @update:modelValue="onFiltersChange"
        />
      </template>
    </div>
  </section>
  <section class="reports-section">
    <ul class="report-table">
      <ProgressBar
        v-if="isLoading"
        mode="indeterminate"
        style="height: .5em"
      />
      <SingleReport
        v-for="item in reports"
        v-bind:key="item.id"
        v-bind:item="item"
      ></SingleReport>
    </ul>
    <Paginator
      :rows="pagination.pageSize"
      :totalRecords="pagination.itemsTotal"
      :rowsPerPageOptions="[10,20,50,100]"
      @page="onPage($event)" />
  </section>
</template>

<script lang="ts">
import { mapActions, mapState } from 'vuex';
import { defineComponent } from 'vue';
import { debounce } from 'lodash-es';
import { Report } from '../services/api';
import SingleReport from './SingleReport.vue';
import EqualFilterWidget from './widgets/filters/Equal.vue';
import StartFilterWidget from './widgets/filters/Start.vue';
import {
  IS_LOADING, PAGINATION, REPORTS_MODULE, State as ReportsState,
} from '../store/reports';
import { FETCH_REPORTS } from '../store/reports/actions';

interface Filter<K extends string, FilterType extends string = 'equal'> {
  name: K;
  checked: boolean;
  filterType: FilterType;
  inputValue: string;
}

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
  name: 'ReportList',
  components: {
    SingleReport,
    EqualFilterWidget,
    StartFilterWidget,
  },
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
      fetchDebounced: debounce(
        () => this.fetchReports(this.fetchParams),
        150, {
          maxWait: 5000,
        },
      ),
      filters: {
        nick: {
          name: 'nick',
          checked: false,
          filterType: 'equal',
          inputValue: '',
        },
        title: {
          name: 'title',
          checked: false,
          filterType: 'equal',
          inputValue: '',
        },
      } as Record<keyof FetchParams['filters'], Filter<keyof FetchParams['filters']>>,
      filterTypes: [{
        name: 'Equal',
        value: 'equal',
      }, {
        name: 'Start',
        value: 'start',
      }],
    };
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
    onComplete(filter: Filter<keyof FetchParams['filters']> & { suggestions: string[] }, { query }: { query: string }) {
      const { data } = this.$store.state[REPORTS_MODULE];
      // eslint-disable-next-line no-param-reassign
      filter.suggestions = Object
        .values(data)
        .map((r) => (filter.name === 'title' ? r.d.title : r.user.nick))
        .filter((f) => f.startsWith(query));
    },
    onFiltersChange() {
      return this.fetchWith(
        {
          filters: Object.values(this.filters).reduce((filters, filter) => {
            if (!(filter.name in filters)) {
              return filters;
            }
            // eslint-disable-next-line no-param-reassign
            filters[filter.name] = {
              value: filter.checked ? filter.inputValue : undefined,
              type: filter.filterType,
            };
            return filters;
          }, this.fetchParams.filters as FetchParams['filters']),
        },
      );
    },
  },
  beforeMount() {
    this.fetchWith({ });
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  margin: 40px 0 0;
  font-size: 28px;
}

.filters {
  .filter-container {
    display: inline-block;
    vertical-align: top;
    border-right: 1px solid gray;
    padding-right: 3px;
    margin-right: 3px;
    &:last-of-type {
      border: none;
    }
  }
}

.report-table {
  list-style: none;
  margin: 0;
  padding: 0;
}

.page-btn {
  width: 200px;
  height: 40px;
}
</style>
