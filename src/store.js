import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import auth0 from "auth0-js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userIsAuthorized: false,
    userSub: "",
    auth0: new auth0.WebAuth({
      domain: process.env.VUE_APP_AUTH0_CONFIG_DOMAIN,
      clientID: process.env.VUE_APP_AUTH0_CONFIG_CLIENTID,
      redirectUri: process.env.VUE_APP_AUTH0_CONFIG_CALLBACKURL,
      audience: process.env.VUE_APP_AUTH0_CONFIG_AUD,
      responseType: process.env.VUE_APP_AUTH0_CONFIG_RESPONSETYPE,
      scope: process.env.VUE_APP_AUTH0_CONFIG_SCOPE
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
          let expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
          );
          localStorage.setItem("access_token", authResult.accessToken);
          localStorage.setItem("id_token", authResult.idToken);
          localStorage.setItem("expires_at", expiresAt);
          localStorage.setItem("user_sub", authResult.idTokenPayload.sub);
          localStorage.setItem("user_scope", authResult.scope);
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
      localStorage.removeItem("user_sub");
      localStorage.removeItem("user_scope");
      window.location.href = "/";
    },
    auth0Refresh(context) {
      return new Promise((resolve, reject) => {
        context.state.auth0.checkSession({}, function(err, authResult) {
          if (authResult && authResult.accessToken && authResult.idToken) {
            let expiresAt = JSON.stringify(
              authResult.expiresIn * 1000 + new Date().getTime()
            );
            localStorage.setItem("access_token", authResult.accessToken);
            localStorage.setItem("id_token", authResult.idToken);
            localStorage.setItem("expires_at", expiresAt);
            localStorage.setItem("user_sub", authResult.idTokenPayload.sub);
            localStorage.setItem("user_scope", authResult.scope);
            resolve(authResult.accessToken);
          } else if (err) {
            alert("login failed");
            console.log(err);
            reject(err);
          }
        });
      });
    }
  }
});
