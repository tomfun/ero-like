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
    <button class="page-btn" @click="handleRepAmountSelect">First</button>
    <select v-model="selected" v-on:change="handleRepAmountSelect">
      <option class="page-btn" disabled value="">Please select one</option>
      <option>10</option>
      <option>20</option>
      <option>50</option>
    </select>
    <button class="page-btn" @click="handleLastPgClick">Last</button>
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
  methods: {
    async getReports(page: number, pageSize: number) {
      const res = await fetch(`/api/report?page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      return data;
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
