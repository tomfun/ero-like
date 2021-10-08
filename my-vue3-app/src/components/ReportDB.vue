<template>
  <section class="reports-section">
    <ul class="report-table">
      <h1>{{ msg }}</h1>
      <SingleReport
        v-for="item in reports"
        v-bind:key="item.id"
        v-bind:item="item"
      ></SingleReport>
    </ul>
    <button class="page-btn" @click="handleFirstPageClick">First</button>
    <button class="page-btn" @click="handleFirstPageClick">Previous</button>
    <select v-model="selected" v-on:change="handleRepAmountSelect">
      <option disabled value="">Please select one</option>
      <option>10</option>
      <option>20</option>
      <option>50</option>
    </select>
    <button class="page-btn" @click="handleNextClick">Next</button>
    <button class="page-btn" @click="handleLastPageClick">Last</button>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SingleReport from './SingleReport.vue';

export default defineComponent({
  name: 'ReportDB',
  props: {
    msg: String,
  },
  components: {
    SingleReport,
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
  // beforeMount() {
  //   this.getReports();
  // },
  methods: {
    async getReports() {
      const res = await fetch('/api/report?page=0&pageSize=10');
      const data = await res.json();
      this.reports = data.items;
      this.reportsArrLength = this.reports.length;
    },
    async handleNextClick() {
      const res = await fetch(
        `/api/report?skip=${parseInt((this.selected), 10) * this.currentPage}&take=${parseInt((this.selected), 10) * (this.currentPage + 1)}&pageSize=${this.selected}`,
      );
      const data = await res.json();
      this.reports = data.items;
      this.currentPage = data.page;
      console.log(data);
    },
    // async handleLastPageClick() {
    // },
    // handleFirstPageClick() {
    // },
    async handleRepAmountSelect() {
      const res = await fetch(
        `/api/report?skip=0&take=${this.selected}&pageSize=${this.selected}`,
      );
      const data = await res.json();
      this.reports = data.items;
      this.currentPage = data.page;
      console.log(data);
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
</style>
