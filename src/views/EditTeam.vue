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
      <router-link v-for="hTeam in hProTeam"
                  :to="{ name: 'addPlayerByTeam', params: { id: id, teamId: hTeam.id } }"
                  :class="{ disabled: teamHasMaxPlayers(hTeam.id) }"
                  >
                  <img v-bind:src="'https://assets.staplepuck.com/logos/' + hTeam.id + '.svg'" width="70" /> 
      </router-link>

      <PlayerSelectDialog :player="selectedPlayer" :league="league" includeAdd="false" includeRemove="true" />

      <div v-for="position in playersInfo">
        <h3>{{ position.name }}</h3>
        <b-container class="bv-example-row">
          <b-row>
            <b-col cols="3" v-for="player in position.players" v-on:click="showPlayer(player.id)">
              <PlayerSelectCard :player="player" :league="league" :fantasyTeamId="id" />
            </b-col>
          </b-row>
        </b-container>
      </div>

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
.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>

<script>
import { GET_TEAM_DATA_FOR_EDIT } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_LEAGUE, QUERY_PLAYERS_HISTORY_BY_LEAGUE, QUERY_TEAMS_BY_SEASON } from "../constants/graphQLqueries/staplePuck2Queries";
import { SET_TEAM_LINEUP } from "../constants/graphQLqueries/graphQLqueries";
import LeagueRules from "../components/LeagueRules";
import { DisplayErrors } from "../serverInputErrors";
import PageSummary from "../components/PageSummary.vue";
import PlayerSelectCard from "../components/PlayerSelectCard.vue";
import PlayerSelectDialog from "../components/PlayerSelectDialog.vue";

export default {
  name: "editTeam",
  components: {
    LeagueRules,
    PageSummary, 
    PlayerSelectCard,
    PlayerSelectDialog
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
      leagueId: 0,
      seasonId: 0,
      selectedPlayer: {},
    };
  },
  computed: {
    proTeams: function () {
      var list = this.fantasyTeams[0].league.season.teamSeasons;
      return list.sort((a, b) =>
        a.team.fullName.localeCompare(b.team.fullName)
      );
    },
    hProTeam: function () {
      const list = this.teamsBySeason;
      return list.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );
    },
    playersInfo() {
      const positions = [];
      if (!this.playersHistoryByLeague) {
        return positions;
      }
      
      const players = [];
      for (let i = 0; i < this.fantasyTeams[0].fantasyTeamPlayers.length; i++) {
          const fp = this.fantasyTeams[0].fantasyTeamPlayers[i];
          
          const player = this.playersHistoryByLeague.find(x => x.id == fp.player.id);
          if (player) {
            players.push(player);
          }
      }

      for (let i = 0; i < this.league.numberPerPositions.length; i++) {
        const position = {
          ...this.league.numberPerPositions[i].positionType,
          players: [],
        };
        const count = this.league.numberPerPositions[i].count;
        
        let pos; 
        const playersByPositon = players.filter(x => x.positionTypeId === position.id);
        for (pos = 0; pos < playersByPositon.length; pos++) {
          const player = {  ...playersByPositon[pos] };

          const teamCount = players.filter(x => x.teamId === player.teamId);
          if (teamCount > this.league.playersPerTeam) {
            player.error = true;
            player.maxTeam = true;
          }
          if (playersByPositon > count) {
            player.error = true;
            player.maxPosition = true;
          }

          position.players.push(player);
        }
        let nextPlayerPos = true;
        while (pos < count) {
          position.players.push({ 
            id: -1, 
            fullName: 'empty',
            positionTypeId: position.id,
            addPlayer: nextPlayerPos
           });
          pos++;
          nextPlayerPos = false;
        }

        positions.push(position);
      }

      return positions;
    }
  },
  props: ["id"],
  apollo: {
    league: {
      client: 'staplePuck2Client',
      query: QUERY_LEAGUE,
      fetchPolicy: 'cache-first',
      variables() {
        return {
          leagueId: this.leagueId
        };
      },
      skip() {
        return this.leagueId === 0;
      }
    },
    teamsBySeason: {
      client: 'staplePuck2Client',
      query: QUERY_TEAMS_BY_SEASON,
      fetchPolicy: 'cache-first',
      variables() {
        return {
          seasonId: this.seasonId
        };
      },
      skip() {
        return this.seasonId === 0;
      }
    },
    playersHistoryByLeague: {
      client: 'staplePuck2Client',
      query: QUERY_PLAYERS_HISTORY_BY_LEAGUE,
      fetchPolicy: 'cache-first',
      variables() {
        return {
          leagueId: this.leagueId
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
        this.seasonId = this.fantasyTeams[0].league.season.id;
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
    },
    showPlayer(playerId) {
      this.selectedPlayer = this.playersHistoryByLeague.find(x => x.id === playerId);
      if (this.selectedPlayer) {
          this.$bvModal.show('player-select-modal');
      }
    },
    teamHasMaxPlayers(teamId) {
      let count = 0;
      for (let [x, value] of Object.entries(this.selected)) {
        if (x == teamId) {
          count++;
          if (count >= this.league.playersPerTeam) {
            return true;
          }
        }
      }
      return false;
    }
  }
};
</script>
