<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>&nbsp;|
      <a
        v-if="!$auth.isAuthenticated && !$auth.loading"
        id="qsLoginBtn"
        @click.prevent="login"
      >Login</a>
      <router-link v-if="$auth.isAuthenticated" to="/user">My Profile</router-link>
      <a
        v-if="$auth.isAuthenticated"
        id="qsLoginBtn"
        @click.prevent="logout"
      >Log Out</a>
    </div>
    <img alt="StaplePuck logo" src="./assets/StaplePuck-Logo.png" width="200" height="200" />
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout();
      this.$router.push({ path: "/" });
    }
  }
};
</script>

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
    text-decoration: underline;
    cursor: pointer;
    &.router-link-exact-active {
      color: rgb(255, 217, 0);
      text-decoration: none;
    }
  }
}
</style>
