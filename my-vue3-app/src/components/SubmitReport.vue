<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Здравствуй! Снова.
    </p>
    
    <form id='form' action="submit">
      <span>Write your report:</span>
      <p style="white-space: pre-line;">{{ message }}</p>
      <br>
      <textarea v-model="message" placeholder="add multiple lines"></textarea>
      <button v-on:click="alertMethod" type="submit">Submit report</button>
    </form>

  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'SubmitReport',
    props: {
    msg: String,
    },
    methods: {
      alertMethod: function () {
        alert('Im working');
      }
    },
  });

  
  // var alertPrototype = new Vue ({
  //  el: '#form',
  //  data: {
      
  //  }
  // })

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
textarea {
  margin: 0 auto;
  width: 40%;
  height: 200px;
  font-size: 16px;
}
form {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
}
button {
  margin: 20px auto;
  width: 10%;
  height: 30px;
}
</style>