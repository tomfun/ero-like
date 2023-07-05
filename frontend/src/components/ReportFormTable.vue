<!-- TBD Move all the tables to HOC -->
<template>
  <TabView>
    <TabPanel header="Simple"> </TabPanel>
    <TabPanel header="Timelined"> </TabPanel>
  </TabView>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

export default defineComponent({
  name: 'ReportFormTable',
  components: {
    TabView,
    TabPanel,
  },
})
</script>
