import Vue from "vue";
import AsyncComputed from "vue-async-computed";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import apolloProvider from "./plugins/apollo";
import { setToken } from "./plugins/apollo";
import { Auth0Plugin, getInstance } from "./auth";
import "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";

import {
  BCardGroup,
  BCard,
  BCardBody,
  BCardText,
  BCardHeader,
  BListGroup,
  BListGroupItem,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BFormRadioGroup,
  BFormRadio,
  BButton,
  BTable,
  BFormSelect,
  ToastPlugin,
  BFormCheckbox
} from "bootstrap-vue";

Vue.config.productionTip = false;
Vue.component("b-card-group", BCardGroup);
Vue.component("b-card", BCard);
Vue.component("b-card-body", BCardBody);
Vue.component("b-card-text", BCardText);
Vue.component("b-card-header", BCardHeader);
Vue.component("b-list-group", BListGroup);
Vue.component("b-list-group-item", BListGroupItem);
Vue.component("b-row", BRow);
Vue.component("b-col", BCol);
Vue.component("b-form", BForm);
Vue.component("b-form-group", BFormGroup);
Vue.component("b-input", BFormInput);
Vue.component("b-form-radio-group", BFormRadioGroup);
Vue.component("b-form-radio", BFormRadio);
Vue.component("b-form-select", BFormSelect);
Vue.component("b-form-checkbox", BFormCheckbox);
Vue.component("b-button", BButton);
Vue.component("b-table", BTable);
Vue.use(ToastPlugin);
Vue.use(AsyncComputed);

Vue.use(Auth0Plugin, {
  onRedirectCallback: async (appState) => {
    console.log("yoooo. i am back");
    const authToken = await instance.getTokenSilently();
    setToken(authToken);
    console.log("set that token: " + authToken);
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

const instance = getInstance();
instance.$watch("loading", async (loading) => {
  if (!loading && instance.isAuthenticated) {
    console.log("new token again!!!");
    const authToken = await instance.getTokenSilently();
    setToken(authToken);
  }
});

new Vue({
  apolloProvider,
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
