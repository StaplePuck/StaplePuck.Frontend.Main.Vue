<template>
  <div id="app">
    <div class="main-content">
      <div class="nav-logo">
        <div id="nav">
          <router-link to="/">Home</router-link>
          <span class="pipes">|</span>
          <a
            v-if="!this.$store.state.userIsAuthorized"
            id="qsLoginBtn"
            @click.prevent="login"
          >Login
          </a>
          <router-link v-if="this.$store.state.userIsAuthorized" to="/user">My Profile</router-link>
          <span class="pipes" v-if="this.$store.state.userIsAuthorized">|</span>
          <a
            v-if="this.$store.state.userIsAuthorized"
            id="qsLoginBtn"
            @click.prevent="logout"
          >Log Out
          </a>
        </div>
        <img
          alt="StaplePuck logo"
          src="./assets/StaplePuck-Logo.png"
          width="200"
          height="200"
        />
      </div>
      <router-view />
    </div>
    <footer>
      <a
        target="_blank"
        href="https://www.termsfeed.com/privacy-policy/1d035b59d3dcbf692dbce4eead4ec7d8"
      >
        Privacy Policy
      </a>
    </footer>
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

<style>
h2 {
  text-align: center;
}
.a-button {
  margin: 0.5em 0;
}
.form-width {
  max-width: 720px;
  margin-right: auto;
  margin-left: auto;
}
</style>
<style scoped lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #30303c;
  position: relative;
  min-height: 100vh;
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
.nav-logo {
  text-align: center;
}
.pipes {
  margin: 0.25em;
}
.main-content {
  padding-bottom: 2.5rem;
}
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;
  text-align: center;
}
</style>
