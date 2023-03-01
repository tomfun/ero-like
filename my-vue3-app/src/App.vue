<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to ="/reports">Reports </router-link> |
    <router-link to="/submit">Submit Report</router-link>
  </div>
  <router-view/>
  <div id="nav-footer">
    <router-link to="/">Home</router-link> |
    <router-link to ="/reports">Reports </router-link> |
    <router-link to="/submit">Submit Report</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/terms">Terms of Use Agreement</router-link>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
