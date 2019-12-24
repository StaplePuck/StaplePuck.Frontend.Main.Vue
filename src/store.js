import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import auth0 from "auth0-js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userIsAuthorized: false,
    auth0: new auth0.WebAuth({
      domain: "staplepuck.auth0.com",
      clientID: "LMz8BpoP7nUZz5YD01QfR6Qi9eGKgYaU",
      redirectUri: "http://localhost:8080/authcallback",
      audience: "auth.staplepuck.com",
      responseType: "token id_token",
      scope: "openid"
    })
  },
  mutations: {
    setUserIsAuthenticated(state, replacement) {
      state.userIsAuthorized = replacement;
    }
  },
  actions: {
    auth0Login(context) {
      context.state.auth0.authorize();
    },
    auth0HandleAuthentication(context) {
      context.state.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log(authResult);
          let expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
          );
          localStorage.setItem("access_token", authResult.accessToken);
          localStorage.setItem("id_token", authResult.idToken);
          localStorage.setItem("expires_at", expiresAt);
          router.replace("/");
        } else if (err) {
          alert("login failed");
          router.replace("/");
          console.log(err);
        }
      });
    },
    auth0Logout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      window.location.href = "/";
    }
  }
});
