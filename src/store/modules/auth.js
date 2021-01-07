import { getInstance } from "../../auth";

// initial state
const state = () => ({
  userSub: localStorage.getItem("auth_sub") || "",
  userToken: localStorage.getItem("auth_token") || "",
  userScope: localStorage.getItem("auth_scope") || "",
  siteName: process.env.VUE_APP_SITE_NAME
});

// getters
const getters = {
  hasUserToken: (state) => {
    return state.userToken != "";
  },
  userIsLeagueOwner: (state) => (leagueId) => {
    if (state.userScope == null) {
      return false;
    }
    const groupName = "League:" + state.siteName + ":" + leagueId;
    const list = state.userScope.split(" ");
    return list.includes(groupName);
  },
  userIsTeamOwner: (state) => (teamId) => {
    if (state.userScope == null) {
      return false;
    }
    const groupName = "Team:" + state.siteName + ":" + teamId;
    const list = state.userScope.split(" ");
    return list.includes(groupName);
  },
  canEditTeam: (state, getters) => (teamId, leagueId) => {
    if (state.userScope == null) {
      return false;
    }
    return (
      getters.userIsLeagueOwner(leagueId) || getters.userIsTeamOwner(teamId)
    );
  }
};

// actions
const actions = {
  auth0Login(context) {
    var instance = getInstance();
    instance.loginWithRedirect({
      appState: {
        targetUrl: window.location.pathname
      }
    });
  },
  async auth0HandleAuthentication({ commit }) {
    const instance = getInstance();
    const token = await instance.getTokenSilently();
    const user = instance.user;
    const decodedToken = await instance.getDecodedToken();

    localStorage.setItem("auth_sub", user.sub);
    localStorage.setItem("auth_scope", decodedToken.scope);
    localStorage.setItem("auth_token", token);

    commit("auth_success", {
      token: token,
      sub: user.sub,
      scope: decodedToken.scope
    });
  },
  auth0Logout({ commit }) {
    var instance = getInstance();
    instance.logout();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_sub");
    localStorage.removeItem("auth_scope");
    commit("auth_logout");
  },
  async auth0Refresh({ commit }) {
    var instance = getInstance();
    var options = {
      domain: process.env.VUE_APP_AUTH0_CONFIG_DOMAIN,
      client_id: process.env.VUE_APP_AUTH0_CONFIG_CLIENTID,
      audience: process.env.VUE_APP_AUTH0_CONFIG_AUD,
      scope: "Team:"
    };
    var token = await instance.getTokenSilently(options);
    const user = instance.user;
    var decodedToken = await instance.getDecodedToken(options);

    localStorage.setItem("auth_sub", user.sub);
    localStorage.setItem("auth_scope", decodedToken.scope);
    localStorage.setItem("auth_token", token);

    commit("auth_success", {
      token: token,
      sub: user.sub,
      scope: decodedToken.scope
    });
  }
};

// mutations
const mutations = {
  auth_success(state, payload) {
    state.userIsAuthorized = true;
    state.userToken = payload.token;
    state.userSub = payload.sub;
    state.userScope = payload.scope;
  },
  auth_logout(state) {
    state.userIsAuthorized = false;
    state.userToken = "";
    state.userSub = "";
    state.userScope = "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
