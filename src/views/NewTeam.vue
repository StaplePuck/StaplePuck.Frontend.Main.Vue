<template>
  <div class="container justify-content-center">
    <h4 v-if="loading">Loading...</h4>
    <div v-else>
      <h2>Create a team for the {{ leagues[0].name }}</h2>
      <div v-if="leagues[0].isLocked" class="container">
        League is Locked!
      </div>
      <div v-else-if="!canJoin" class="container">
        You already have a team in this league.
      </div>
      <div v-else class="form-width">
        <form @submit="createTeam">
          <div class="form-group">
            <label label-for="teamName">Team Name:</label>
            <input
              type="text"
              id="teamName"
              class="form-control"
              required
              trim
              v-model="newTeam.name"
            />
            <input
              class="btn btn-secondary a-button"
              type="submit"
              value="Next >"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { QUERY_TEAMS_IN_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
import { CREATE_TEAM } from "../constants/graphQLqueries/graphQLqueries";
import { DisplayErrors } from "../serverInputErrors";

export default {
  name: "newTeam",
  props: ["id"],
  computed: {
    leagueIsLocked: function () {
      return this.leagues[0].isLocked;
    },
    canJoin: function () {
      if (this.leagues[0].allowMultipleTeams) {
        return true;
      }
      if (!this.leagues[0].fantasyTeams) {
        return false;
      }
      const sub = localStorage.getItem("user_sub");
      var i;
      for (i = 0; i < this.leagues[0].fantasyTeams.length; i++) {
        if (this.leagues[0].fantasyTeams[i].gM.externalId == sub) {
          return false;
        }
      }
      return true;
    }
  },
  apollo: {
    leagues: {
      query: QUERY_TEAMS_IN_LEAGUE,
      variables() {
        return {
          leagueid: this.id
        };
      }
    }
  },
  data() {
    return {
      leagues: {},
      newTeam: { name: "" },
      loading: 0
    };
  },
  methods: {
    createTeam(evt) {
      evt.preventDefault();
      this.$apollo
        .mutate({
          mutation: CREATE_TEAM,
          variables: {
            fantasyTeam: {
              name: this.newTeam.name,
              leagueId: this.id
            }
          }
        })
        .then((data) => {
          const newTeamId = data.data.createFantasyTeam.id;
          console.log("get new token");
          this.$auth.refreshToken().then(() => {
            this.$router.push({ name: "editTeam", params: { id: newTeamId } });
          });
          // this.$store.dispatch("auth0Refresh").then(() => {
          //   this.$router.push({ name: "editTeam", params: { id: newTeamId } });
          // });
        })
        .catch((error) => {
          console.error(error);
          DisplayErrors(this.$bvToast, error);
        });
    }
  }
};
</script>
