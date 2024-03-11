import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import teamEdit from "./modules/teamEdit";
import createMutationsSharer from "vuex-shared-mutations";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    auth,
    teamEdit
  },
  plugins: [createMutationsSharer({ predicate: [
    "teamEdit/addPlayer", 
    "teamEdit/removePlayer",
    "teamEdit/initialTeam",
    "teamEdit/updateTeamName"
  ] })],
  strict: debug
});
