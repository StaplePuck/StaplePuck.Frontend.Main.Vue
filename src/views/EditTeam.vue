<template>
  <div class="container">
    <div v-for="(team, idx) in fantasyTeams" :key="idx">
      <div class="row align-items-center profile-header">
        <div class="col-md text-center">
          <h2>{{ team.name }}</h2>
          You must selcet one player from each NHL team and the following number
          of players: 10 Forwards (F), 4 Defenseman (D), and 2 Goalies (G)<br />
          :Scoring Rules:<br />
          Forwards - Points per Goal: 3 Points per Assist: 2 <br />
          Defensemen - Points per Goal: 4 Points per Assist: 3 <br />
          Goalies - Win: 5 Shutout: 5 Points per Goal: 10 Points per Assist: 4
          <br />
          Bonus points - Overtime goal: +5 Series clinching goal: +5 Shorthanded
          goal: +2 <br />
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
        <ServerInputErrors
          :graphError="graphError"
          :key="graphErrorKey"
        ></ServerInputErrors>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_TEAM_DATA_FOR_EDIT } from "../constants/graphQLqueries/graphQLqueries";
import { SET_TEAM_LINEUP } from "../constants/graphQLqueries/graphQLqueries";
import ServerInputErrors from "../components/ServerInputErrors";

export default {
  name: "editTeam",
  components: {
    ServerInputErrors
  },
  data() {
    return {
      selected: {},
      teamOptions: {},
      graphError: null,
      graphErrorKey: 0
    };
  },
  computed: {
    proTeams: function() {
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
        .catch(error => {
          this.graphError = error;
          this.graphErrorKey += 1;
        });
    }
  }
};
</script>
