import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import User from "./views/UserProfile.vue";
import NewTeam from "./views/NewTeam.vue";
import EditTeam from "./views/EditTeam.vue";
import NewUser from "./views/NewUser.vue";
import LeagueManage from "./views/LeagueManage.vue";
import League from "./views/LeagueTeams.vue";
import Team from "./views/Team.vue";
import AuthCallback from "./views/AuthCallback.vue";
import Store from "./store";
import Unauthorized from "./views/Unauthorized.vue";
import { authGuard } from "./auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/newUser",
      name: "newUser",
      component: NewUser,
      beforeEnter: authGuard
    },
    {
      path: "/user",
      name: "user",
      component: User,
      beforeEnter: authGuard
    },
    {
      path: "/league/:id",
      name: "league",
      component: League,
      props: true
    },
    {
      path: "/league/:id/newTeam",
      name: "newTeam",
      component: NewTeam,
      props: true,
      beforeEnter: authGuard
    },
    {
      path: "/league/:id/manage",
      name: "leagueManage",
      component: LeagueManage,
      props: true,
      beforeEnter: authGuard
    },
    {
      path: "/team/:id/edit",
      name: "editTeam",
      component: EditTeam,
      props: true,
      beforeEnter: authGuard
    },
    {
      path: "/team/:id",
      name: "team",
      component: Team,
      props: true
    },
    {
      path: "/unauthorized",
      name: "unauthorized",
      component: Unauthorized
    }
  ]
});

export default router;
