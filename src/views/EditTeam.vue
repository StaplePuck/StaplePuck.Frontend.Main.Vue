<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
      <PageSummary :headline="team.name">
        <p>
          Set the lineup for your team.
        </p>
      </PageSummary>
      <LeagueRules :leagueId="team.league.id"></LeagueRules>
      <form @submit="saveTeam" class="form-width">
        <label label-for="teamName">Team Name:</label>
        <input
          type="text"
          id="teamName"
          class="form-control"
          required
          trim
          v-model="teamName"
        />
        <br />
        <br />

        <div class="form-group" v-for="(pTeam, idy) in proTeams" :key="idy">
          <label label-for="'team_' + pTeam.team.id">
            {{ pTeam.team.fullName }}:
          </label>
          <select
            :id="'team_' + pTeam.team.id"
            class="form-control"
            v-model="selected[pTeam.team.id]"
          >
            <option
              v-bind:value="team.value"
              v-for="(team, idz) in teamOptions[pTeam.team.id]"
              :key="idz"
            >
              {{ team.text }}
            </option>
          </select>
        </div>
        <div v-show="saveSuccess" class="alert alert-success">
          Save Successful
        </div>
        <div v-show="saveFailed" class="alert alert-danger">
          <p>Save Complete but Not Valid:</p>
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
      </form>
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
import { GET_TEAM_DATA_FOR_EDIT } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_LEAGUE_HISTORY } from "../constants/graphQLqueries/staplePuck2Queries";
import { SET_TEAM_LINEUP } from "../constants/graphQLqueries/graphQLqueries";
import LeagueRules from "../components/LeagueRules";
import { DisplayErrors } from "../serverInputErrors";
import PageSummary from "../components/PageSummary.vue";

export default {
  name: "editTeam",
  components: {
    LeagueRules,
    PageSummary
  },
  data() {
    return {
      selected: {},
      teamOptions: {},
      loading: 0,
      saving: 0,
      saveSuccess: false,
      saveFailed: false,
      saveErrors: {},
      teamName: '',
      leagueId: 0
    };
  },
  computed: {
    proTeams: function () {
      var list = this.fantasyTeams[0].league.season.teamSeasons;
      return list.sort((a, b) =>
        a.team.fullName.localeCompare(b.team.fullName)
      );
    }
  },
  props: ["id"],
  apollo: {
    leaguHistory: {
      client: 'staplePuck2Client',
      query: QUERY_LEAGUE_HISTORY,
      variables() {
        return {
          leagueid: this.leagueId
        };
      },
      skip() {
        return this.leagueId === 0;
      }
    },
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
        for (i = 0; i < this.fantasyTeams[0].fantasyTeamPlayers.length; i++) {
          const fp = this.fantasyTeams[0].fantasyTeamPlayers[i];
          list.push(fp.player.id);
        }

        this.teamName = this.fantasyTeams[0].name;
        this.leagueId = this.fantasyTeams[0].league.id;
        const ts = this.fantasyTeams[0].league.season.teamSeasons;
        for (i = 0; i < ts.length; i++) {
          var j;
          var ps = ts[i].playerSeasons.sort((a, b) =>
            a.player.fullName.localeCompare(b.player.fullName)
          );
          let playerList = [];
          for (j = 0; j < ps.length; j++) {
            if (list.includes(ts[i].playerSeasons[j].player.id)) {
              this.selected[ts[i].team.id] = ts[i].playerSeasons[j].player.id;
            }
            playerList.push({
              value: ps[j].player.id,
              text: ps[j].player.fullName + " - " + ps[j].positionType.shortName
            });
          }
          this.teamOptions[ts[i].team.id] = playerList;
        }
      }
    }
  },
  methods: {
    saveTeam(evt) {
      evt.preventDefault();
      this.saving = 1;
      this.saveSuccess = false;
      this.saveFailed = false;
      var fantasyTeamPlayers = [];

      for (let [, value] of Object.entries(this.selected)) {
        fantasyTeamPlayers.push({ playerId: Number(value) });
      }
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
        })
        .catch((error) => {
          this.saveSuccess = false;
          this.saveFailed = true;
          this.saveErrors = DisplayErrors(this.$bvToast, error);
          this.saving = 0;
        });
    }
  }
};
</script>
