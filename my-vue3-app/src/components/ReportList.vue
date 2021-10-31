<template>
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
     <vue-loading
      type="bars"
      color="#d9544e"
      :size="{ width: '50px', height: '50px'}" />
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
import SingleReport from './SingleReport.vue';
import { REPORTS_MODULE } from '../store/reports';
import { FETCH_REPORTS } from '../store/reports/actions';

export default defineComponent({
  name: 'ReportList',
  components: {
    SingleReport,
  },
  computed: {
    pagination() {
      return this.$store.state[REPORTS_MODULE].pagination;
    },
    reports() {
      return this.$store.state[REPORTS_MODULE].data;
    },
    isLoading() {
      return this.$store.state[REPORTS_MODULE].isLoading;
    },
  },
  methods: {
    ...mapActions(REPORTS_MODULE, {
      fetchReports: FETCH_REPORTS,
    }),
    async onPage({ page, rows: pageSize }: {page: number; rows: number}) {
      this.fetchReports({ page, pageSize });
    },
  },
  beforeMount() {
    this.onPage({ page: 0, rows: 10 });
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
