import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

Vue.use(VueApollo);

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_CLIENT
});

var _authToken;

export function setToken(token) {
  _authToken = token;
}

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: _authToken ? `Bearer ${_authToken}` : null
    }
  });
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

export default new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      loadingKey: "loading",
      fetchPolicy: "cache-and-network"
    }
  }
});
