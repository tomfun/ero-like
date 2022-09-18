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
    nick: string;
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
    // nick() {
    //   return this.$store.state[REPORTS_MODULE].pagination.filters.nick;
    // },
  },
  watch: {
    pagination() {
      // watch pagination dirty thing
    },
    nick() {
      this.onNickInput();
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
            nick: this.nick,
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
