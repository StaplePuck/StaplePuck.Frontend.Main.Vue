<template>
  <div class="container">
    <div class="row align-items-center profile-header" v-if="leagues[0]">
      <div class="col-md text-center">
        <h2>Create a team for the {{ leagues[0].name }}</h2>
      </div>
      <div v-if="leagues[0].isLocked" class="container">
        League is Locked!
      </div>
      <div v-else-if="!canJoin" class="container">
        You already have a team in this league.
      </div>
      <div v-else class="container">
        <b-form @submit="createTeam">
          <div class="text-left">
            <b-form-group
              label-cols-sm="3"
              label="Team Name:"
              label-align-sm="right"
              label-for="teamName"
            >
              <b-input
                id="teamName"
                v-model="newTeam.name"
                required
                trim
              ></b-input>
            </b-form-group>

            <div class="text-center">
              <b-button type="submit">Next &gt;</b-button>
            </div>
          </div>
        </b-form>
        <ServerInputErrors
          :graphError="graphError"
          :key="graphErrorKey"
        ></ServerInputErrors>
      </div>
    </div>
  </div>
</template>

<script>
import { QUERY_TEAMS_IN_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
import { CREATE_TEAM } from "../constants/graphQLqueries/graphQLqueries";
import ServerInputErrors from "../components/ServerInputErrors";

export default {
  name: "newTeam",
  components: {
    ServerInputErrors
  },
  props: ["id"],
  computed: {
    leagueIsLocked: function() {
      return this.leagues[0].isLocked;
    },
    canJoin: function() {
      if (this.leagues[0].allowMultipleTeams) {
        return true;
      }
      if (!this.leagues[0].fantasyTeams) {
        console.log("not sure");
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
      graphError: null,
      graphErrorKey: 0
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
        .then(data => {
          const newTeamId = data.data.createFantasyTeam.id;
          this.$router.push({ name: "editTeam", params: { id: newTeamId } });
        })
        .catch(error => {
          this.graphError = error;
          this.graphErrorKey += 1;
        });
    }
  }
};
</script>
