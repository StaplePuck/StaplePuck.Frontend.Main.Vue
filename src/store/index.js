import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import teamEdit from "./modules/teamEdit";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    auth,
    teamEdit
  },
  strict: debug
});
