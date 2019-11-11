import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { Auth0Plugin } from "./auth/AuthWrap";
import store from "./store";
import "./registerServiceWorker";

import { authdomain, authclientid } from "./config/authConfig";

Vue.config.productionTip = false;

Vue.use(Auth0Plugin, {
  authdomain,
  authclientid,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
