<template>
  <div id="nav">
    <router-link :to="{ name: 'Home' }">Home</router-link> |
    <router-link :to="{ name: 'Reports' }">Reports</router-link> |
    <router-link :to="{ name: 'Submit' }">Submit Report</router-link>
  </div>
  <router-view/>
  <div id="nav-footer">
    <router-link :to="{ name: 'Home' }">Home</router-link> |
    <router-link :to="{ name: 'Reports' }">Reports </router-link> |
    <router-link :to="{ name: 'UserRegistration' }">Register</router-link> |
    <router-link :to="{ name: 'Submit' }">Submit Report</router-link> |
    <router-link :to="{ name: 'About' }">About</router-link> |
    <router-link :to="{ name: 'Terms' }">Terms of Use Agreement</router-link>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

div.center, #nav, #nav-footer  {
  text-align: center;
}

#nav, #nav-footer {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#nav-footer {
  border-top: #2c3e50 2px solid;
}
</style>
