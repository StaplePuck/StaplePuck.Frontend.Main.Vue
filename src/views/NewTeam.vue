<template>
  <div class="container justify-content-center">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else>
      <PageSummary headline="New team">
        <p>
          Create a team for the <i>{{ leagues[0].name }}</i>
        </p>
      </PageSummary>
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
            <div v-show="saveFailed" class="alert alert-danger">
              <p
                v-for="(thisError, index) in saveErrors"
                :key="`saveErrors-${index}`"
              >
                {{ thisError }}
              </p>
            </div>
            <button
              class="btn btn-secondary a-button"
              type="submit"
              :disabled="saving == 1"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                v-if="saving == 1"
              ></span>
              Next &gt;
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
label {
  margin-bottom: 0;
  font-weight: bold;
}
</style>

<script>
import { QUERY_TEAMS_IN_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
import { CREATE_TEAM } from "../constants/graphQLqueries/graphQLqueries";
import { DisplayErrors } from "../serverInputErrors";
import PageSummary from "../components/PageSummary.vue";

export default {
  name: "newTeam",
  components: {
    PageSummary
  },
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
      const sub = this.$store.state.auth.userSub;
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
      loading: 0,
      saving: 0,
      saveFailed: false,
      saveErrors: {}
    };
  },
  methods: {
    createTeam(evt) {
      evt.preventDefault();
      this.saving = 1;
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
          this.saveFailed = false;
          const newTeamId = data.data.createFantasyTeam.id;
          this.$store.dispatch("auth/auth0Refresh").then(() => {
            this.$router.push({ name: "editTeam", params: { id: newTeamId } });
            this.saving = 0;
          });
        })
        .catch((error) => {
          this.saveFailed = true;
          this.saveErrors = DisplayErrors(this.$bvToast, error);
          this.saving = 0;
        });
    }
  }
};
</script>
