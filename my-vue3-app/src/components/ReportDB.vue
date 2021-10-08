<template>
  <section class="reports-section">
    <ul class="report-table">
      <SingleReport
        v-for="item in reports"
        v-bind:key="item.id"
        v-bind:item="item"
      ></SingleReport>
    </ul>
    <button class="page-btn" @click="handleRepAmountSelect">First</button>
    <select v-model="selected" v-on:change="handleRepAmountSelect">
      <option class="page-btn" disabled value="">Please select one</option>
      <option>10</option>
      <option>20</option>
      <option>50</option>
    </select>
    <button class="page-btn" @click="handleLastPgClick">Last</button>
    <p>vuex page: {{ pagination.page }}</p>
    <p>vuex pageSize: {{ pagination.pageSize }}</p>
    <p>vuex itemsTotal: {{ pagination.itemsTotal }}</p>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SingleReport from './SingleReport.vue';
import { REPORTS_MODULE } from '../store/reports';

export default defineComponent({
  name: 'ReportDB',
  components: {
    SingleReport,
  },
  computed: {
    pagination() {
      return this.$store.state[REPORTS_MODULE].pagination;
    },
  },
  data() {
    return {
      reports: [],
      currentPage: 0,
      firstPageReports: [],
      reportsArrLength: 0,
      selected: '',
    };
  },
  methods: {
    async getReports(page: number, pageSize: number) {
      const res = await fetch(`/api/report?page=${page}&pageSize=${pageSize}`);
      return res.json();
    },
    async handleRepAmountSelect() {
      const data = await this.getReports(0, +this.selected);
      this.reports = data.items;
      this.reportsArrLength = data.itemsTotal;
    },
    async handleLastPgClick() {
      const currentLastPage = Math.floor(this.reportsArrLength / +this.selected);
      const data = await this.getReports(currentLastPage, +this.selected);
      this.reports = data.items;
    },
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
