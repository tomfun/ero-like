<template>
  <li class="table-element">
    <div class="main-frame">
      <div class="main-frame__left-column">
        <div class="main-frame__prop-block">
          <h3 class="main-frame__prop-title">Уличное название:</h3>
          <h4>{{ item.substances[0].name }}</h4>
        </div>
        <div class="main-frame__prop-block">
          <h3 class="main-frame__prop-title">Действующее вещество:</h3>
          <h4>{{ item.substances[0].activeSubstance }}</h4>
        </div>
        <div class="main-frame__prop-block">
          <h3 class="main-frame__prop-title">Уверенность в товаре:</h3>
          <h4>{{ item.substances[0].sure }}</h4>
        </div>
      </div>
      <div class="main-frame__right-column">
        <h2>{{ item.title }}</h2>
        <p>Здесь будет сам репорт. Можно попросить пользователя озаглавить свой рассказ.</p>
        <p class="main-frame__author">{{ item.nick }}</p>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SingleReport',
  props: {
    item: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.table-element {
  width: 90%;
  margin: auto 50px;
  margin-top: 70px;
}
.main-frame {
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  border-radius: 10px;
}
.main-frame__prop-title {
  margin: 20px;
  text-decoration: underline;
}
.main-frame__right-column {
  width: 100%;
}
.main-frame__right-column:last-child {
  justify-content: flex-end;
}
.main-frame__author {
  position: relative;
  bottom: 0;
}
</style>
