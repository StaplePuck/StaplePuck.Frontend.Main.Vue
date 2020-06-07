<template>
  <div class="container">
    <h4 v-if="loading">Loading...</h4>
    <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
      <div class="row align-items-center profile-header">
        <div class="col-md text-center">
          <h2>{{ team.name }}</h2>
          <LeagueRules :leagueId="team.league.id"></LeagueRules>
        </div>
      </div>
      <div class="container">
        <b-form @submit="saveTeam">
          <div class="text-left">
            <div v-for="(pTeam, idy) in proTeams" :key="idy">
              <b-form-group label-cols-sm="3" label-align-sm="right">
                <template v-slot:label>
                  {{ pTeam.team.fullName }}
                </template>
                <b-form-select
                  :options="teamOptions[pTeam.team.id]"
                  v-model="selected[pTeam.team.id]"
                >
                </b-form-select>
              </b-form-group>
            </div>
            <div class="text-center">
              <b-button type="submit">Save</b-button>
            </div>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_TEAM_DATA_FOR_EDIT } from "../constants/graphQLqueries/graphQLqueries";
import { SET_TEAM_LINEUP } from "../constants/graphQLqueries/graphQLqueries";
import LeagueRules from "../components/LeagueRules";
import { UserIsLeagueOwner } from "../userAuthorization";
import { UserIsTeamOwner } from "../userAuthorization";
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
      loading: 0
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
      async result() {
        const list = [];
        var i;
        if (this.fantasyTeams == null) {
          return;
        }
        if (this.fantasyTeams[0].league.isLocked) {
          this.$router.push({ name: "unauthorized" });
        }
        const scope = await this.$auth.getDecodedToken().scope; //localStorage.getItem("user_scope");
        if (
          !UserIsLeagueOwner(this.fantasyTeams[0].league.id, scope) &&
          !UserIsTeamOwner(this.fantasyTeams[0].id, scope)
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
          this.$bvToast.toast("Team saved", {
            title: "Success",
            autoHideDelay: 5000,
            variant: "success",
            toaster: "b-toaster-top-center",
            appendToast: true
          });
        })
        .catch(error => {
          this.$bvToast.toast("Team saved but is not valid", {
            title: "Warning",
            autoHideDelay: 5000,
            variant: "warning",
            toaster: "b-toaster-top-center",
            appendToast: true
          });
          DisplayErrors(this.$bvToast, error);
        });
    }
  }
};
</script>
