<template>
  <div id="app">
    <div class="main-content">
      <div class="nav-logo">
        <header>
          <div id="nav">
            <router-link to="/">Home</router-link>
            <span class="pipes">|</span>
            <a
              v-if="!$auth.isAuthenticated && !$auth.loading"
              id="qsLoginBtn"
              @click.prevent="login"
              >Login
            </a>
            <router-link v-if="$auth.isAuthenticated" to="/myTeams"
              >My Teams</router-link
            >
            <span class="pipes" v-if="$auth.isAuthenticated">|</span>
            <router-link v-if="$auth.isAuthenticated" to="/user"
              >My Profile</router-link
            >
            <span class="pipes" v-if="$auth.isAuthenticated">|</span>
            <a
              v-if="$auth.isAuthenticated"
              id="qsLoginBtn"
              @click.prevent="logout"
              >Log Out
            </a>
          </div>
        </header>
        <img
          alt="StaplePuck logo"
          src="./assets/StaplePuckLogo.png"
          width="200"
          height="200"
        />
      </div>
      <router-view />
    </div>
    <footer>
      <a
        target="_blank"
        rel="noreferrer"
        href="https://www.termsfeed.com/privacy-policy/1d035b59d3dcbf692dbce4eead4ec7d8"
      >
        Privacy Policy
      </a>
    </footer>
  </div>
</template>

<script>
import { QUERY_USER_PROFILE } from "./constants/graphQLqueries/graphQLqueries";
import pushNotifications from "./plugins/pushNotifications";

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
          !this.$store.getters["auth/hasUserToken"] ||
          this.$route.name == "newUser"
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
      this.$store.dispatch("auth/auth0Login");
    },
    logout() {
      this.$store.dispatch("auth/auth0Logout");
    }
  }
};
</script>

<style>
h1 {
  text-align: center;
  font-size: 2em;
  font-weight: 700;
}
h2 {
  text-align: center;
  font-size: 2em;
  font-weight: 700;
}
.a-button {
  margin: 0.5em 0;
}
.form-width {
  max-width: 720px;
  margin-right: auto;
  margin-left: auto;
}
ul {
  margin-bottom: 0;
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
    cursor: pointer;
    text-decoration: underline;
    &.router-link-exact-active {
      background-color: #ffc107;
      text-decoration: none;
      padding-right: 0.6em;
      padding-left: 0.6em;
      border-radius: 10rem;
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
  a {
    color: darkblue;
    text-decoration: underline;
  }
}
</style>
