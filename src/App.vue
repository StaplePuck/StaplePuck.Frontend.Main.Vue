<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <span class="pipes">|</span>
      <a
        v-if="!this.$store.state.userIsAuthorized"
        id="qsLoginBtn"
        @click.prevent="login"
      >Login</a>
      <router-link v-if="this.$store.state.userIsAuthorized" to="/user">My Profile</router-link>
      <span class="pipes" v-if="this.$store.state.userIsAuthorized">|</span>
      <a
        v-if="this.$store.state.userIsAuthorized"
        id="qsLoginBtn"
        @click.prevent="logout"
      >Log Out</a>
    </div>
    <img
      alt="StaplePuck logo"
      src="./assets/StaplePuck-Logo.png"
      width="200"
      height="200"
    />
    <router-view />
  </div>
</template>

<script>
import { QUERY_USER_PROFILE } from "./constants/graphQLqueries/graphQLqueries";

export default {
  data() {
    return {
      clientId: process.env.VUE_APP_AUTH0_CONFIG_DOMAIN
    };
  },
  apollo: {
    currentUser: {
      query: QUERY_USER_PROFILE,
      skip() {
        return (
          !this.$store.state.userIsAuthorized || this.$route.name == "newUser"
        );
      },
      result({ data }) {
        if (
          data != null &&
          (data.currentUser == null ||
            data.currentUser.name == null ||
            data.currentUser.name == "")
        ) {
          this.$router.push("/newUser");
        }
      },
      error() {}
    }
  },
  methods: {
    login() {
      this.$store.dispatch("auth0Login");
    },
    logout() {
      this.$store.dispatch("auth0Logout");
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style scoped lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #30303c;
}
#nav {
  padding-top: 15px;
  padding-bottom: 0;
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
.pipes {
  margin: 0.25em;
}
</style>
