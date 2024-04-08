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
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faSnowflake } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { BootstrapVue } from "bootstrap-vue";

dom.watch();
library.add(fas);
library.add(faInstagram);
library.add(faFacebook);
library.add(faSnowflake);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
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
