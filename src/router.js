import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import User from "./views/UserProfile.vue";
import NewUser from "./views/NewUser.vue";
import League from "./views/LeagueTeams.vue";
import AuthCallback from "./views/AuthCallback.vue";
import Store from "./store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/authcallback",
      name: "authcallback",
      component: AuthCallback
    },
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/newUser",
      name: "newUser",
      component: NewUser,
      meta: { requiresAuth: true }
    },
    {
      path: "/user",
      name: "user",
      component: User,
      meta: { requiresAuth: true }
    },
    {
      path: "/league/:id",
      name: "league",
      component: League,
      props: true
    }
  ]
});

router.beforeEach((to, from, next) => {
  // Allow finishing callback url for logging in
  if (to.matched.some(record => record.path == "/authcallback")) {
    Store.dispatch("auth0HandleAuthentication");
    next(false);
  }

  // check if user is logged in (start assuming the user is not logged in = false)
  let routerAuthCheck = false;
  // Verify all the proper access variables are present for proper authorization
  if (
    localStorage.getItem("access_token") &&
    localStorage.getItem("id_token") &&
    localStorage.getItem("expires_at")
  ) {
    // Check whether the current time is past the Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    // set localAuthTokenCheck true if unexpired / false if expired
    routerAuthCheck = new Date().getTime() < expiresAt;
  }

  // set global ui understanding of authentication
  Store.commit("setUserIsAuthenticated", routerAuthCheck);

  // check if the route to be accessed requires authorizaton
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is Authenticated
    if (routerAuthCheck) {
      // user is Authenticated - allow access
      next();
    } else {
      // user is not authenticated - redirect to login
      router.replace("/");
    }
  }
  // Allow page to load
  else {
    next();
  }
});

export default router;
