import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Auth0Plugin } from "./auth";
import "./registerServiceWorker";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
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
import { domain, clientId, audience } from "../auth_config.json";

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
Vue.use(VueApollo);

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_CLIENT
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("access_token");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  });
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      loadingKey: "loading",
      fetchPolicy: "cache-and-network"
    }
  }
});

new Vue({
  apolloProvider,
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
