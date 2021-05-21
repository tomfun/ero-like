<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <SingleReport
      v-for="item in data.items"
      v-bind:key="item.id"
      v-bind:item="item"
    ></SingleReport>
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
      data: {
        items: [],
      },
    };
  },
  beforeMount() {
    this.getName();
  },
  methods: {
    async getName() {
      const res = await fetch('/api/report');
      const data = await res.json();
      this.data = data;
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
</style>
