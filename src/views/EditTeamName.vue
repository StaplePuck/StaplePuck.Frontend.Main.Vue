<template>
    <div class="container">
      <h4 v-if="loading" class="text-center">Loading...</h4>
      <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
        <PageSummary :headline="team.name">
          <p>
            Change team name.
          </p>
        </PageSummary>
  
  
        <div v-if="team.league.isLocked" class="container">
            League is Locked!
        </div>
        <div v-else class="form-width">
            <form @submit="changeName">
            <div class="form-group">
                <label label-for="teamName">Team Name:</label>
                <input
                    type="text"
                    id="teamName"
                    class="form-control"
                    required
                    trim
                    v-model="teamName"
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
                    Save
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
  .disabled {
      opacity: 0.5;
      pointer-events: none;
  }
  </style>
  
  <script>
  import { GET_TEAM_DATA_FOR_EDIT } from "../constants/graphQLqueries/graphQLqueries";
  import { SET_TEAM_LINEUP } from "../constants/graphQLqueries/graphQLqueries";
  import { DisplayErrors } from "../serverInputErrors";
  import PageSummary from "../components/PageSummary.vue";
  
  export default {
    name: "editTeamName",
    components: {
      PageSummary, 
    },
    data() {
      return {
        loading: 1,
        saving: 0,
        saveSuccess: false,
        saveFailed: false,
        saveErrors: {},
        team: {},
        teamName: '',
        leagueId: 0,
        seasonId: 0,
      };
    },
    computed: {
    },
    props: ["id"],
    apollo: {
      fantasyTeams: {
        query: GET_TEAM_DATA_FOR_EDIT,
        variables() {
          return {
            teamid: Number(this.id)
          };
        },
        result() {
          const list = [];
          var i;
          if (this.fantasyTeams == null) {
            return;
          }
          if (this.fantasyTeams[0].league.isLocked) {
            this.$router.push({ name: "unauthorized" });
          }
          const sub = this.$store.state.auth.userSub;
          if (
            !this.$store.getters["auth/canEditTeam"](
              this.fantasyTeams[0].id,
              this.fantasyTeams[0].league.id
            ) &&
            this.fantasyTeams[0].gM.externalId != sub
          ) {
            this.$router.push({ name: "unauthorized" });
          }
          
          this.team = this.fantasyTeams[0];
          this.teamName = this.fantasyTeams[0].name;
          this.loading = 0;
        }
      }
    },
    methods: {
        changeName(evt) {
            evt.preventDefault();
            this.saving = 1;
            this.saveSuccess = false;
            this.saveFailed = false;
            var fantasyTeamPlayers = [];

            this.$apollo
                .mutate({
                mutation: SET_TEAM_LINEUP,
                variables: {
                    fantasyTeam: {
                    id: Number(this.id),
                    name: this.teamName,
                    fantasyTeamPlayers: fantasyTeamPlayers
                    }
                }
                })
                .then(() => {
                this.saveFailed = false;
                this.saveSuccess = true;
                this.saving = 0;
                this.$router.push({ name: "editTeam", params: { id: this.id } });
                this.$router.go();
                })
                .catch((error) => {
                this.saveSuccess = false;
                this.saveFailed = true;
                this.saving = 0;
                this.saveErrors = DisplayErrors(this.$bvToast, error);
                });
        }
    }
  };
  </script>
  