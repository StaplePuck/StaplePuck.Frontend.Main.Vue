<template>
  <header>
    <nav id="main-nav">
      <router-link to="/">Home</router-link>
      <router-link v-if="$auth.isAuthenticated" to="/myTeams"
        >My Teams</router-link
      >
      <router-link v-if="$auth.isAuthenticated" to="/user"
        >My Profile</router-link
      >
      <a
        v-if="!$auth.isAuthenticated && !$auth.loading"
        id="qsLoginBtn"
        @click.prevent="login"
        >Sign In
      </a>
      <a v-if="$auth.isAuthenticated" id="qsLoginBtn" @click="logout"
        >Sign Out
      </a>
      <a class="icon" @click.prevent="showMenu()">
        <i class="fa fa-bars"></i>
      </a>
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
nav {
  overflow: hidden;
  background-color: #ffc107;
}
nav a {
  font-weight: 700;
  float: left;
  display: block;
  color: #000;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  &.router-link-exact-active {
    background-color: #000;
    text-decoration: none;
    color: #fff;
  }
  &.router-link-exact-active:hover {
    background-color: #000;
    text-decoration: none;
    color: #fff;
  }
}
nav a:hover {
    color: #000;
}
nav a:not([href]):hover {
  text-decoration: underline;
  cursor: pointer;
}
nav a.active {
  background-color: #ffc107;
  color: #000;
}
nav .icon {
  display: none;
  background-color: #ffc107;
  color: #000;
}
@media screen and (max-width: 576px) {
  nav a:not(:first-child) {
    display: none;
  }
  nav a.icon {
    float: right;
    display: block;
  }
  nav.responsive {
    position: relative;
  }
  nav.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  nav.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
}
</style>
