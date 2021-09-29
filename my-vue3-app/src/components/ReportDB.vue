<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
      <SingleReport
        v-for="item in data"
        v-bind:key="item.id"
        v-bind:item="item"
      ></SingleReport>
      <button  v-on:click="handleMoreClick">MOARE!!</button>
  </div>
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
      data: [],
      pageCounter: 1,
      reportsArray: [],
    };
  },
  beforeMount() {
    this.getName();
  },
  methods: {
    async getName() {
      const res = await fetch('/api/report');
      const data = await res.json();
      this.data = data.items.slice(0, 10);
      this.reportsArray = data.items;
    },
    handleMoreClick: function handleMoreButtonClick() {
      this.pageCounter += 1;
      this.data = this.reportsArray.slice(0, 10 * this.pageCounter);
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

button {
  width: 200px;
  height: 30px;
  margin: 30px
}
</style>
