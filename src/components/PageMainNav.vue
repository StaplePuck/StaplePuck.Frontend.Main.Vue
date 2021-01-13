<template>
  <header>
    <nav>
      <div class="row main-nav">
        <router-link to="/" class="logo-link">
          <img alt="StaplePuck logo" src="../assets/logos/StaplePuck.jpg" />
        </router-link>
        <router-link v-if="$auth.isAuthenticated" to="/myTeams"
          >My Teams</router-link
        >
        <router-link v-if="$auth.isAuthenticated" to="/user"
          >Profile</router-link
        >
        <a
          v-if="!$auth.isAuthenticated && !$auth.loading"
          id="qsLoginBtn"
          @click.prevent="login"
          >Log In
        </a>
        <a v-if="$auth.isAuthenticated" id="qsLoginBtn" @click="logout"
          >Log Out
        </a>
      </div>
    </nav>
  </header>
</template>
<script>
import { QUERY_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries";
import pushNotifications from "../plugins/pushNotifications";
export default {
  name: "PageMainNav",
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
    },
    showMenu() {
      let x = document.getElementById("main-nav");
      if (x !== null) {
        if (x.classList.contains("responsive")) {
          x.classList.remove("responsive");
        } else {
          x.classList.add("responsive");
        }
      }
    }
  }
};
</script>
<style lang="scss">
.main-nav {
  align-items: center;
}
nav {
  overflow: hidden;
  background-color: #30313c;
  padding-left: 1rem;
  padding-right: 1.5rem;
}
nav a {
  font-weight: 500;
  float: left;
  display: block;
  color: #fff;
  text-align: center;
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  font-size: 15px;
  &.router-link-exact-active:hover {
    background-color: #30313c;
    text-decoration: underline;
    color: #fff;
  }
}
nav a:hover {
  color: #fff;
}
nav a:not([href]) {
  color: #fff;
  cursor: pointer;
}
nav a:not([href]):hover {
  color: #fff;
  text-decoration: underline;
  cursor: pointer;
}
nav a:last-child {
  margin-left: auto;
}
</style>
