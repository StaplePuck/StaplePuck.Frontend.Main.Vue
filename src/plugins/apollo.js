import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import store from "../store";

Vue.use(VueApollo);

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_CLIENT
});

const authLink = new ApolloLink((operation, forward) => {
  const token = store.state.auth.userToken;
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  });
  return forward(operation);
});

const staplePuck2HttpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_STAPLEPUCK2_CLIENT
});

const staplePuck2AuthLink = new ApolloLink((operation, forward) => {
  const apiKey = process.env.VUE_APP_GRAPHQL_STAPLEPUCK2_APKKEY;
  operation.setContext({
    headers: {
      'x-api-key': apiKey
    }
  });
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    PlayerHistory: {
      keyFields: ["id", "leagueId"],
    },
    PlayerHistory: {
      keyFields: ["id", "leagueId"],
    },
    Player: {
      keyFields: ["id", "seasonId"],
    },
    Team: {
      keyFields: ["id", "seasonId"],
    },
  }),
  connectToDevTools: true
});

export const staplePuck2Client = new ApolloClient({
  link: staplePuck2AuthLink.concat(staplePuck2HttpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

export default new VueApollo({
  clients: {
    apolloClient,
    staplePuck2Client
  },
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      loadingKey: "loading",
      fetchPolicy: "cache-and-network"
    }
  }
});
