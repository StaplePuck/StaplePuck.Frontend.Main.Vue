<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/user">My Profile</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #30303c;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #30303c;
    &.router-link-exact-active {
      color: rgb(255, 217, 0);
      text-decoration: none;
    }
  }
}
</style>
