import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import apolloProvider from "./plugins/apollo";
import { Auth0Plugin, getInstance } from "./auth";
import "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";

import {
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
  BTable,
  BFormCheckbox
} from "bootstrap-vue";

Vue.config.productionTip = false;
Vue.component("b-form", BForm);
Vue.component("b-form-group", BFormGroup);
Vue.component("b-input", BFormInput);
Vue.component("b-form-checkbox", BFormCheckbox);
Vue.component("b-button", BButton);
Vue.component("b-table", BTable);

Vue.use(Auth0Plugin, {
  onRedirectCallback: async (appState) => {
    store.dispatch("auth/auth0HandleAuthentication").then(() => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      );
    });
  }
});

new Vue({
  apolloProvider,
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
