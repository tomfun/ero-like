<template>
  <div class="submitReportForm">
    Only registered users can submit reports
    <router-link :to="{ name: 'UserRegistration' }">register</router-link>
    <br>
    <h1 class="submitReportForm__title">Расскажите о ваших впечатлениях в подробностях</h1>
      <input v-model="id" disabled v-if="id">
      <input v-model="title" placeholder="Add title">
      <br />
      <textarea v-model="reportText" placeholder="add your report"></textarea>
      <br />
      <button v-on:click="handleSubmit">Отправить</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SubmitReport',
  data() {
    return {
      id: '',
      nick: '',
      title: '',
      reportText: '',
      gpgSignature: '',
    };
  },
  methods: {
    async handleSubmit() {
      const requestOptions = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // id: '5424b448-2450-4fd2-9883-8000de6f8343',
          gpgSigned: false,
          substances: [
            {
              name: 'Хмурый',
              activeSubstance: 'heroin',
              sure: '70',
            },
          ],
          nick: this.reportText,
          title: this.title,
        }),
      };
      const response = await fetch('/api/report', requestOptions);
      const data = await response.json();
      this.$data.id = data.id;
      this.$data.nick = data.nick;
      this.$data.title = data.title;
      this.$data.reportText = data.reportText; // ... hm
      this.$data.gpgSignature = data.gpgSignature;
    },
  },
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
