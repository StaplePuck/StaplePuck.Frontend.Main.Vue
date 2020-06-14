<template>
  <div class="container">
    <h4 v-if="loading">Loading...</h4>
    <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
      <div class="row align-items-center profile-header">
        <div class="col-md">
          <h1>{{ team.name }}</h1>
          <LeagueRules :leagueId="team.league.id"></LeagueRules>
        </div>
      </div>
      <form @submit="saveTeam" class="form-width">
        <div class="form-group" v-for="(pTeam, idy) in proTeams" :key="idy">
          <label label-for="'team_' + pTeam.team.id">
            <b>{{ pTeam.team.fullName }}:</b>
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
        <input class="btn btn-secondary a-button" type="submit" value="Save" />
      </form>
    </div>
  </div>
</template>

<script>
import { GET_TEAM_DATA_FOR_EDIT } from "../constants/graphQLqueries/graphQLqueries";
import { SET_TEAM_LINEUP } from "../constants/graphQLqueries/graphQLqueries";
import LeagueRules from "../components/LeagueRules";
import { DisplayErrors } from "../serverInputErrors";

export default {
  name: "editTeam",
  components: {
    LeagueRules
  },
  data() {
    return {
      selected: {},
      teamOptions: {},
      loading: 0,
      saveSuccess: false,
      saveFailed: false,
      saveErrors: {}
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
    fantasyTeams: {
      query: GET_TEAM_DATA_FOR_EDIT,
      variables() {
        return {
          teamid: this.id
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
        if (
          !this.$store.getters["auth/canEditTeam"](
            this.fantasyTeams[0].id,
            this.fantasyTeams[0].league.id
          )
        ) {
          this.$router.push({ name: "unauthorized" });
        }
        for (i = 0; i < this.fantasyTeams[0].fantasyTeamPlayers.length; i++) {
          const fp = this.fantasyTeams[0].fantasyTeamPlayers[i];
          list.push(fp.player.id);
        }

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
      this.saveSuccess = false;
      this.saveFailed = false;
      var fantasyTeamPlayers = [];

      for (let [, value] of Object.entries(this.selected)) {
        fantasyTeamPlayers.push({ playerId: value });
      }
      this.$apollo
        .mutate({
          mutation: SET_TEAM_LINEUP,
          variables: {
            fantasyTeam: {
              id: this.id,
              fantasyTeamPlayers: fantasyTeamPlayers
            }
          }
        })
        .then(() => {
          this.saveFailed = false;
          this.saveSuccess = true;
        })
        .catch((error) => {
          this.saveSuccess = false;
          this.saveFailed = true;
          this.saveErrors = DisplayErrors(this.$bvToast, error);
        });
    }
  }
};
</script>
