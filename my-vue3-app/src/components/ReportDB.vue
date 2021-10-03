<template>
  <section class="reports-section">
    <ul class="report-table">
      <h1>{{ msg }}</h1>
      <SingleReport
        v-for="item in currentPageReports"
        v-bind:key="item.id"
        v-bind:item="item"
      ></SingleReport>
    </ul>
    <button class="page-btn" @click="handleFirstPageClick">1</button>
    <button class="page-btn" @click="handleLastPageClick">last</button>
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
      currentPageReports: [],
      firstPageReports: [],
      lastPageReports: [],
    };
  },
  beforeMount() {
    this.getReports();
  },
  methods: {
    async getReports() {
      const res = await fetch('/api/report');
      const data = await res.json();
      this.reports = data.items;
      this.currentPageReports = data.items.slice(0, 10);
      this.firstPageReports = data.items.slice(0, 10);
      this.lastPageReports = data.items.slice(data.items.length - 10, data.items.length);
    },
    handleLastPageClick() {
      this.currentPageReports = this.lastPageReports;
    },
    handleFirstPageClick() {
      this.currentPageReports = this.firstPageReports;
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
