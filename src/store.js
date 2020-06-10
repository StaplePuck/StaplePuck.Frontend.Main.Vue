import Vue from "vue";
import Vuex from "vuex";
import { getInstance } from "./auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userIsAuthorized: false,
    userSub: localStorage.getItem("user_sub") || "",
    userToken: localStorage.getItem("access_token") || "",
    userScope: localStorage.getItem("user_scope") || ""
  },
  getters: {
    hasUserToken: (state) => {
      return state.userToken != "";
    }
  },
  mutations: {
    setUserIsAuthenticated(state, replacement) {
      state.userIsAuthorized = replacement;
    },
    auth_success(state, token, sub, scope) {
      state.userIsAuthorized = true;
      state.userToken = token;
      state.userSub = sub;
      state.scope = scope;
    },
    auth_logout(state) {
      state.userIsAuthorized = false;
      state.userToken = "";
      state.userSub = "";
      state.scope = "";
    }
  },
  actions: {
    auth0Login(context) {
      var instance = getInstance();
      instance.loginWithRedirect({
        appState: {
          targetUrl: window.location.pathname
        }
      });
    },
    async auth0HandleAuthentication({ commit }) {
      const instance = getInstance();
      const token = await instance.getTokenSilently();
      const user = instance.user;
      const decodedToken = await instance.getDecodedToken();

      localStorage.setItem("user_sub", user.sub);
      localStorage.setItem("user_scope", decodedToken.scope);
      localStorage.setItem("access_token", token);

      commit("auth_success", token, user.sub, decodedToken.scope);
    },
    auth0Logout({ commit }) {
      var instance = getInstance();
      instance.logout();
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_sub");
      localStorage.removeItem("user_scope");
      commit("auth_logout");
    },
    async auth0Refresh({ commit }) {
      var instance = getInstance();
      instance.checkSession();
      const token = await instance.getTokenSilently();
      const user = instance.user;
      const decodedToken = await instance.getDecodedToken();
      console.log("new Token: " + token);

      localStorage.setItem("user_sub", user.sub);
      localStorage.setItem("user_scope", decodedToken.scope);
      localStorage.setItem("access_token", token);

      commit("auth_success", token, user.sub, decodedToken.scope);
      // return new Promise((resolve, reject) => {
      //   context.state.auth0.checkSession({}, function (err, authResult) {
      //     if (authResult && authResult.accessToken && authResult.idToken) {
      //       let expiresAt = JSON.stringify(
      //         authResult.expiresIn * 1000 + new Date().getTime()
      //       );
      //       localStorage.setItem("access_token", authResult.accessToken);
      //       localStorage.setItem("id_token", authResult.idToken);
      //       localStorage.setItem("expires_at", expiresAt);
      //       localStorage.setItem("user_sub", authResult.idTokenPayload.sub);
      //       localStorage.setItem("user_scope", authResult.scope);
      //       resolve(authResult.accessToken);
      //     } else if (err) {
      //       alert("login failed");
      //       //eslint-disable-next-line
      //       console.log(err);
      //       reject(err);
      //     }
      //   });
      //});
    }
  }
});
