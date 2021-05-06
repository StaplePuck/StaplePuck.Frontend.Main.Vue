<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else>
      <PageSummary :headline="teamInfo.name">
        <p>
          Overall stats for all players on this team.
        </p>
      </PageSummary>
      <div class="align-items-center profile-header">
        <div class="col-md team-info">
          <div class="card">
            <div class="card-body">
              <ul>
                <li>
                  <span>League: </span>
                  <router-link
                    class="card-links"
                    :to="{ name: 'league', params: { id: id } }"
                    >{{ teamInfo.leagueName }}</router-link
                  >
                </li>
                <li><span>Team State:</span> {{ teamInfo.state }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md team-info">
          <span class="player-info table-success"># = Player on your team</span>
        </div>
        <section id="scroll-table" class="col-md">
          <table class="table table-bordered table-striped table-condensed cf">
            <thead class="cf">
              <tr>
                <th
                  v-for="(col, colID) in computedFields"
                  :key="colID"
                  v-on:click="sortTable(col.key)"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody v-if="players">
              <tr
                v-for="(row, rowID) in players"
                :key="rowID"
                v-bind:class="row.rowColor"
              >
                <td v-for="(col, colID) in computedFields" :key="colID">
                  {{ row[col.key] }}
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr
                v-for="(row, rowID) in computedData"
                :key="rowID"
                v-bind:class="row.rowColor"
              >
                <td v-for="(col, colID) in computedFields" :key="colID">
                  {{ row[col.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <LeagueRules :leagueId="id"></LeagueRules>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.team-info {
  margin-bottom: 1em;
}
.player-info {
  text-decoration: none;
  padding-right: 0.6em;
  padding-left: 0.6em;
}
table th,
table td {
  cursor: pointer;
  padding: 0.25em;
}
.sorted {
  text-decoration: underline;
}
.unsorted {
  text-decoration: none;
}
@media only screen and (max-width: 800px) {
  #scroll-table.cf:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
  #scroll-table * html .cf {
    zoom: 1;
  }
  #scroll-table *:first-child + html .cf {
    zoom: 1;
  }

  #scroll-table table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  #scroll-table th,
  #scroll-table td {
    margin: 0;
    vertical-align: top;
  }
  #scroll-table th {
    text-align: left;
  }

  #scroll-table table {
    display: block;
    position: relative;
    width: 100%;
  }
  #scroll-table thead {
    display: block;
    float: left;
  }
  #scroll-table tbody {
    display: block;
    width: auto;
    position: relative;
    overflow-x: auto;
    white-space: nowrap;
  }
  #scroll-table thead tr {
    display: block;
  }
  #scroll-table th {
    display: block;
    text-align: right;
  }
  #scroll-table tbody tr {
    display: inline-block;
    vertical-align: top;
  }
  #scroll-table td {
    display: block;
    min-height: 1.25em;
    text-align: left;
  }

  /* sort out borders */
  #scroll-table th {
    border-bottom: 0;
    border-left: 0;
  }
  #scroll-table td {
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
  }
  #scroll-table tbody tr {
    border-left: 1px solid #babcbf;
  }
  #scroll-table th:last-child,
  #scroll-table td:last-child {
    border-bottom: 1px solid #babcbf;
  }
}
</style>

<script>
import { GET_TEAM_SCORE } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_SCORING_TYPES_FOR_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
import { GET_FANTASY_PLAYERS_FOR_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
import LeagueRules from "../components/LeagueRules";
import PageSummary from "../components/PageSummary.vue";

var getScoringData = function (scoring, id) {
  var i;
  for (i = 0; i < scoring.length; i++) {
    if (scoring[i].scoringType.id == id) {
      return scoring[i];
    }
  }
  return null;
};

export default {
  name: "teamStats",
  components: {
    LeagueRules,
    PageSummary
  },
  data() {
    return {
      ascending: false,
      sortColumn: "score",
      players: this.computedData,
      fantasyTeams: null,
      loading: 0
    };
  },
  computed: {
    teamInfo() {
      const info = {};
      const player = this.playerCalculatedScoresForTeam[0];
      info.name = player.playerSeason.team.fullName;
      info.leagueName = player.league.name;
      const state = player.playerSeason.teamStateForSeason.gameState;
      if (state == 0) {
        info.state = "Day off";
      } else if (state == -1) {
        info.state = "Eliminated";
      } else {
        info.state = "Playing";
      }

      return info;
    },
    computedFields() {
      const field = [];
      field.push({
        key: "fullName",
        label: "Player"
      });
      field.push({
        key: "score",
        label: "Total Points"
      });
      field.push({
        key: "todaysScore",
        label: "Today's Points"
      });
      field.push({
        key: "position",
        label: "Position"
      });
      this.scoringTypeHeadersForTeam.forEach((x) => {
        field.push({
          key: "score" + x.id,
          label: x.shortName
        });
      });
      field.push({
        key: "numberPicked",
        label: "Picked"
      });
      return field;
    },
    computedData() {
      const data = [];
      this.playerCalculatedScoresForTeam.forEach((x) => {
        var row = {};
        row.fullName = x.player.fullName;
        row.position = x.playerSeason.positionType.shortName;
        row.score = x.score;
        row.todaysScore = x.todaysScore;
        row.numberPicked = x.numberOfSelectedByTeams;
        if (this.playerIsOnUsersTeam(x.player.id)) {
          row.rowColor = "table-success";
          row.fullName = " # " + x.player.fullName;
        }

        this.scoringTypeHeadersForTeam.forEach((s) => {
          var text = "0";
          var scoringData = getScoringData(x.scoring, s.id);
          if (scoringData != null) {
            text = scoringData.score;
            if (scoringData.todaysScore > 0) {
              text += " (" + scoringData.todaysScore + ")";
            }
          }
          row["score" + s.id] = text;
        });

        data.push(row);
        data.sort((a, b) => {
          return a.score > b.score ? -1 : 1;
        });
        this.players = data;
      });
      return data;
    }
  },
  methods: {
    sortTable(col) {
      if (this.sortColumn === col) {
        this.ascending = !this.ascending;
      } else {
        this.ascending = true;
        this.sortColumn = col;
      }
      var ascending = this.ascending;
      this.computedData.sort(function (a, b) {
        if (a[col] > b[col]) {
          return ascending ? 1 : -1;
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1;
        }
        return 0;
      });
    },
    playerIsOnUsersTeam(playerId) {
      var i, j;
      for (i = 0; i < this.myFantasyTeams.length; i++) {
        for (j = 0; j < this.myFantasyTeams[i].fantasyTeamPlayers.length; j++) {
          if (playerId == this.myFantasyTeams[i].fantasyTeamPlayers[j].playerId)
            return true;
        }
      }
      return false;
    }
  },
  props: ["id", "teamId"],
  apollo: {
    playerCalculatedScoresForTeam: {
      query: GET_TEAM_SCORE,
      variables() {
        return {
          teamId: this.teamId,
          leagueId: this.id
        };
      }
    },
    scoringTypeHeadersForTeam: {
      query: QUERY_SCORING_TYPES_FOR_LEAGUE,
      variables() {
        return {
          leagueId: this.id
        };
      }
    },
    myFantasyTeams: {
      query: GET_FANTASY_PLAYERS_FOR_LEAGUE,
      variables() {
        return {
          leagueId: this.id
        };
      }
    }
  }
};
</script>
