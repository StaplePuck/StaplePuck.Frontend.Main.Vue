import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import 'bootstrap/dist/css/bootstrap.css'
import { BCardGroup, BCard, BCardText, BCardHeader, BListGroup, BListGroupItem } from 'bootstrap-vue'

Vue.config.productionTip = false;
Vue.component('b-card-group', BCardGroup);
Vue.component('b-card', BCard);
Vue.component('b-card-text', BCardText);
Vue.component('b-card-header', BCardHeader);
Vue.component('b-list-group', BListGroup);
Vue.component('b-list-group-item', BListGroupItem);

const httpLink = new HttpLink({
  uri: "http://api.staplepuck.com/graphql"
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  }
})

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
