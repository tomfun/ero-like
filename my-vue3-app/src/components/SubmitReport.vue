<template>
  <!-- <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Сайт для наркетов!
    </p>
    <h3>Installed CLI Plugins</h3>
  </div> -->
  <div class="submitReportForm">
    <h1 class="submitReportForm__title">Расскажите о ваших впечатлениях в подробностях</h1>
      <input v-model="title" placeholder="Add title">
      <p>The title is: {{ title }}</p>
      <br />
      <br />
      <span>Multiline message is:</span>
      <p style="white-space: pre-line;">{{ reportText }}</p>
      <br />
      <textarea v-model="reportText" placeholder="add your report"></textarea>
      <br />
      <br />
      <button v-on:click="handleSubmit">Отправить</button>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SubmitReport',
  props: {
    msg: String,
  },
  data() {
    return {
      title: '',
      reportText: '',
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

      console.log(data);
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
