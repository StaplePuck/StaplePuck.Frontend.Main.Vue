import Vue from "vue";
//import Vuex from "vuex";
import createAuth0Client from "@auth0/auth0-spa-js";

//Vue.use(Vuex);

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

let instance;

export const getInstance = () => instance;

export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirect_uri = window.location.origin,
  ...options
}) => {
  if (instance) return instance;

  instance = new Vue({
    data() {
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Client: null,
        popupOpen: false,
        error: null
      };
    },
    methods: {
      async loginWithPopup(o) {
        this.popupOpen = true;

        try {
          await this.auth0Client.loginWithPopup(o);
        } catch (e) {
          console.error(e);
        } finally {
          this.popupOpen = false;
        }

        alert("popup");
        this.user = await this.auth0Client.getUser();
        this.isAuthenticated = true;
      },
      async handleRedirectCallback() {
        this.loading = true;
        try {
          await this.auth0Client.handleRedirectCallback();
          this.user = await this.auth0Client.getUser();
          this.isAuthenticated = true;
          // localStorage.setItem("access_token", authResult.accessToken);
          // localStorage.setItem("id_token", authResult.idToken);
          // localStorage.setItem("expires_at", expiresAt);
          // localStorage.setItem("user_sub", authResult.idTokenPayload.sub);
          // localStorage.setItem("user_scope", authResult.scope);
          alert("callback");
        } catch (e) {
          this.error = e;
        } finally {
          this.loading = false;
        }
      },
      async getDecodedToken() {
        const jwtToken = await this.auth0Client.getTokenSilently();
        let jwtData = jwtToken.split(".")[1];
        let decodedJwtJsonData = window.atob(jwtData);
        let decodedJwtData = JSON.parse(decodedJwtJsonData);
        return decodedJwtData;
      },
      loginWithRedirect(o) {
        return this.auth0Client.loginWithRedirect(o);
      },
      getIdTokenClaims(o) {
        return this.auth0Client.getIdTokenClaims(o);
      },
      getTokenSilently(o) {
        return this.auth0Client.getTokenSilently(o);
      },
      getTokenWithPopup(o) {
        return this.auth0Client.getTokenWithPopup(o);
      },
      logout(o) {
        return this.auth0Client.logout(o);
      }
    },
    async created() {
      this.auth0Client = await createAuth0Client({
        domain: options.domain,
        client_id: options.clientId,
        audience: options.audience,
        redirect_uri
      });

      try {
        if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) {
          const { appState } = await this.auth0Client.handleRedirectCallback();
          const token = await this.getDecodedToken();
          console.log(token.scope);
          const accessToken = await this.$auth.getTokenSilently();

          localStorage.setItem("access_token", accessToken);
          //localStorage.setItem("id_token", authResult.idToken);
          //localStorage.setItem("expires_at", expiresAt);
          localStorage.setItem("user_scope", token.scope);
          onRedirectCallback(appState);
        }
      } catch (e) {
        this.error = e;
      } finally {
        this.isAuthenticated = await this.auth0Client.isAuthenticated();
        this.user = await this.auth0Client.getUser();
        this.loading = false;
      }
    }
  });

  return instance;
};

export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options);
  }
};
