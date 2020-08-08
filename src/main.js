import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import apolloProvider from "./plugins/apollo";
import {
  PushNotificationsPlugin,
  requestNotificationPermission
} from "./plugins/pushNotifications";
import { Auth0Plugin } from "./auth";
import "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import { BTable } from "bootstrap-vue";

Vue.config.productionTip = false;
Vue.component("b-table", BTable);

Vue.use(PushNotificationsPlugin);
Vue.use(Auth0Plugin, {
  onRedirectCallback: async (appState) => {
    store.dispatch("auth/auth0HandleAuthentication").then(() => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      );
    });
  },
  onAuthorized: () => {
    requestNotificationPermission();
  }
});

new Vue({
  apolloProvider,
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
