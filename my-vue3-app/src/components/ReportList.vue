<template>
  <section class="reports-section">
    <ul class="report-table">
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

    <p>vuex page: {{ pagination.page }}</p>
    <p>vuex pageSize: {{ pagination.pageSize }}</p>
    <p>vuex itemsTotal: {{ pagination.itemsTotal }}</p>
    <p>vuex reports: {{ reports }}</p>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SingleReport from './SingleReport.vue';
import { REPORTS_MODULE } from '../store/reports';

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
  },
  methods: {
    async getReports(page: number, pageSize: number) {
      const res = await fetch(`/api/report?page=${page}&pageSize=${pageSize}`);
      return res.json();
    },
    async onPage({ page, rows: pageSize }: {page: number; rows: number}) {
      this.reports = (await this.getReports(page, pageSize)).items;
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
}

.page-btn {
  width: 200px;
  height: 40px;
}
</style>
