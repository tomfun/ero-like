<template>
  <section class="reports-section">
    <ul class="report-table">
      <ProgressBar
        mode="indeterminate"
        class="progress-bar"
        :class="{progressbar_active: barStatus}" />
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
  },
  data() {
    return {
      barStatus: false,
    };
  },
  methods: {
    ...mapActions(REPORTS_MODULE, {
      fetchReports: FETCH_REPORTS,
    }),
    async onPage({ page, rows: pageSize }: {page: number; rows: number}) {
      this.fetchReports({ page, pageSize });
    },
    toggleProgressBar() {
      console.log(this.barStatus);
      this.barStatus = !(this.barStatus);
      console.log(this.barStatus);
    },
  },
  // beforeCreate() {
  //   this.toggleProgressBar();
  // },
  beforeMount() {
    this.toggleProgressBar();
    this.onPage({ page: 0, rows: 10 });
  },
  mounted() {
    this.toggleProgressBar();
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

.progress-bar{
  display: none;
}

.progressbar_active{
  display: block;
}
</style>
