<template>
  <section class="reports-section">
    <ul class="report-table">
      <ProgressBar
        v-if="isLoading"
        mode="indeterminate"
        style="height: .5em"
      />
      <h1>Filters: </h1>
      <div
        :filter="filter"
        id="{{filter.name}}"
        v-for="(filter, index) in filters"
        v-bind:key="index"
        class="m-2">
        <input class="mx-1" type="checkbox" :value="filter.name" v-model="filter.checked"/>
        <label>{{filter.name}}</label>
        <div v-if="filter.checked">
          <select v-model="filter.filterType">
            <option
              v-for="(filType, index) in filterTypes"
              v-bind:key="index">
              {{filType.name}}
            </option>
          </select>
          <input v-model="filter.inputValue" placeholder="edit me"/>
        </div>
      </div><br>
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
import { mapActions } from 'vuex';
import { defineComponent } from 'vue';
import { debounce } from 'lodash-es';
import SingleReport from './SingleReport.vue';
import { REPORTS_MODULE } from '../store/reports';
import { FETCH_REPORTS } from '../store/reports/actions';

type FetchParams = {
  page: number;
  pageSize: number;
  filters: {
    nick: {
      value: string | undefined;
      type: string | undefined;
    };
    title: {
      value: string | undefined;
      type: string | undefined;
    };
  };
};

export default defineComponent({
  name: 'ReportList',
  components: {
    SingleReport,
  },
  data() {
    return {
      nick: '',
      fetchParams: { page: 0, pageSize: 10 } as FetchParams,
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
      },
      filterTypes: [{
        name: 'equal',
      }, {
        name: 'contain',
      }],
    };
  },
  computed: {
    pagination() {
      return this.$store.state[REPORTS_MODULE].pagination;
    },
    reports() {
      const { data } = this.$store.state[REPORTS_MODULE];
      return this.$store.state[REPORTS_MODULE].pagination.viewIds.map((id) => data[id]);
    },
    isLoading() {
      return this.$store.state[REPORTS_MODULE].isLoading;
    },
  },
  watch: {
    pagination() {
      // watch pagination dirty thing
    },
    filters: {
      handler(newValue, oldValue) {
        if (newValue.nick.inputValue.length === 0 && newValue.title.inputValue.length === 0) {
          this.fetchWith({ filters: undefined });
          return;
        }
        this.onFiltersChange();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(REPORTS_MODULE, {
      fetchReports: FETCH_REPORTS,
    }),
    async fetchWith(fetchParams: Partial<FetchParams>) {
      this.fetchParams = { ...this.fetchParams, ...fetchParams };
      this.fetchDebounced();
    },
    async onPage({ page, rows: pageSize }: {page: number; rows: number}) {
      this.fetchWith({ page, pageSize });
    },
    async onFiltersChange() {
      const nickFilter = this.filters.nick;
      const nickFilterType = nickFilter?.filterType;
      const nickValue = nickFilter?.inputValue;
      // maybe we should map it somehow
      const titleFilter = this.filters.title;
      const titleFilterType = titleFilter?.filterType;
      const titleValue = titleFilter?.inputValue;
      this.fetchWith(
        {
          filters: {
            nick: {
              value: nickValue,
              type: nickFilterType,
            },
            title: {
              value: titleValue,
              type: titleFilterType,
            },
          },
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
