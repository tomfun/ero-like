<template>
  <section class="reports-section">
    <ul class="report-table">
      <ProgressBar
        v-if="isLoading"
        mode="indeterminate"
        style="height: .5em"
      />
      <input v-model="nick" placeholder="edit me">
      <p>The nick you are looking for is: {{ nick }}</p>
      <p>Filters: {{ filters }}</p>
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
    nick() {
      this.onNickInput();
    },
    filters: {
      handler(newValue, oldValue) {
        if (newValue.nick.inputValue.length === 0) { // avoid empty nick request
          this.fetchWith({ });
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
    async onNickInput() {
      this.fetchWith(
        {
          filters: {
            nick: {
              value: this.nick,
              type: this.filters.nick.filterType,
            },
          },
        },
      );
    },
    async onFiltersChange() {
      const curFilter = this.filters.nick;
      const nickFilter = curFilter?.filterType;
      const nickValue = curFilter?.inputValue;

      this.fetchWith(
        {
          filters: {
            nick: {
              value: nickValue,
              type: nickFilter,
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
  font-size: 48px;
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
