<template>
  <div class="container">
    <h1 v-if="loading" class="text-center">Loading...</h1>
    <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
      <PageSummary :headline="team.name">
        <p>
          Set the lineup for your team.
        </p>
      </PageSummary>
      <div class="text-center mb-2">
        <router-link
                    :to="{ name: 'editTeamName', params: { id: id } }"
                    >
                    Change Team Name
        </router-link>  
      </div>
      <LeagueRules :leagueId="team.league.id"></LeagueRules>
      <div v-if="fantasyTeamValidation">
        <ul>
          <li v-for="item in fantasyTeamValidation">{{ item.message }}</li>
        </ul>
      </div>
      <div class="px-1">
        <span class="d-block px-3 mb-3 font-weight-bold">Click a logo to select a player from that team:</span>
        <router-link v-for="hTeam in hProTeam"
                    :to="{ name: 'addPlayerByTeam', params: { id: id, teamId: hTeam.id } }"
                    :class="{ disabled: teamHasMaxPlayers(hTeam.id) }"
                    >
                    <img v-bind:src="'https://assets.staplepuck.com/logos/' + hTeam.id + '.svg'" width="70" /> 
        </router-link>
      </div>
      
      <PlayerSelectDialog :fantasyTeamId="id" :player="selectedPlayer" :league="league" :fantasyTeam="fantasyTeams[0]" includeAdd="false" includeRemove="true" />

      <div v-for="position in playersInfo">
        <h3>{{ position.name }}</h3>
        <b-container>
          <b-row>
            <b-col cols="3" v-for="player in position.players" v-on:click="showPlayer(player.id)">
              <PlayerSelectCard :player="player" :league="league" :fantasyTeamId="id" />
            </b-col>
          </b-row>
        </b-container>
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
import { GET_TEAM_DATA_FOR_EDIT, GET_TEAM_VALIDATION } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_LEAGUE, QUERY_PLAYERS_HISTORY_BY_LEAGUE, QUERY_TEAMS_BY_SEASON } from "../constants/graphQLqueries/staplePuck2Queries";
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
      loading: 0,
      saving: 0,
      saveSuccess: false,
      saveFailed: false,
      saveErrors: {},
      selectedPlayer: {},
      teamLoaded: false
    };
  },
  computed: {
    fantasyTeam() {
      return this.$store.state.teamEdit.fantasyTeam;
    },
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
      for (let i = 0; i < this.fantasyTeam.playerIds.length; i++) {
          const fp = this.fantasyTeam.playerIds[i];
          
          const player = this.playersHistoryByLeague.find(x => x.id == fp);
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
          leagueId: this.fantasyTeam?.leagueId
        };
      },
      skip() {
        return !this.teamLoaded;
      }
    },
    teamsBySeason: {
      client: 'staplePuck2Client',
      query: QUERY_TEAMS_BY_SEASON,
      fetchPolicy: 'cache-first',
      variables() {
        return {
          seasonId: this.fantasyTeam?.seasonId
        };
      },
      skip() {
        return !this.teamLoaded;
      }
    },
    playersHistoryByLeague: {
      client: 'staplePuck2Client',
      query: QUERY_PLAYERS_HISTORY_BY_LEAGUE,
      fetchPolicy: 'cache-first',
      variables() {
        return {
          leagueId: this.fantasyTeam?.leagueId
        };
      },
      skip() {
        return !this.teamLoaded;
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

        this.$store.commit('teamEdit/initialTeam', this.fantasyTeams[0]);
        this.teamLoaded = true;

        for (i = 0; i < this.fantasyTeams[0].fantasyTeamPlayers.length; i++) {
          const fp = this.fantasyTeams[0].fantasyTeamPlayers[i];
          list.push(fp.player.id);
        }
        
        const ts = this.fantasyTeams[0].league.season.teamSeasons;
        for (let i = 0; i < ts.length; i++) {
          var ps = ts[i].playerSeasons.sort((a, b) =>
            a.player.fullName.localeCompare(b.player.fullName)
          );
          for (let j = 0; j < ps.length; j++) {
            if (list.includes(ts[i].playerSeasons[j].player.id)) {
              this.selected[ts[i].team.id] = ts[i].playerSeasons[j].player.id;
            }
          }
        }
      }
    },
    fantasyTeamValidation: {
      query: GET_TEAM_VALIDATION,
      variables() {
        return {
          teamid: Number(this.id)
        };
      }
    }
  },
  methods: {
    showPlayer(playerId) {
      if (playerId > 1) {
        this.selectedPlayer = this.playersHistoryByLeague.find(x => x.id === playerId);
        if (this.selectedPlayer) {
            this.$bvModal.show('player-select-modal');
        }
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
