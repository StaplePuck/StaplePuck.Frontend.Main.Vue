<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else class="align-items-center profile-header">
      <div class="col-md team-info">
        <div class="card">
          <div class="card-header">
            <h2>Overall Stats</h2>
          </div>
          <div class="card-body">
            <ul>
              <li>
                <span>League: </span>
                <router-link
                  class="card-links"
                  :to="{ name: 'league', params: { id: id } }"
                  >{{ leagues[0].name }}</router-link
                >
              </li>
              <li>
                <span>Positions:</span>
                <multiselect
                  v-model="positions"
                  label="name"
                  track-by="id"
                  :options="positionOptions"
                  :searchable="false"
                  :multiple="true"
                  :allow-empty="false"
                >
                  <template slot="singleLabel" slot-scope="{ option }"
                    ><strong>{{ option.name }}</strong></template
                  >
                </multiselect>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md team-info">
        <span>* = Team Eliminated</span>
        <br />
        <span>+ = Team in Play Today</span>
        <br />
        <span class="player-info table-success"># = Player on your team</span>
      </div>
      <section id="scroll-table" class="col-md">
        <table class="table table-bordered table-condensed cf">
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
                <div v-if="col.key == 'teamName'">
                  <router-link
                    :to="{
                      name: 'teamStats',
                      params: {
                        id: playerCalculatedScores[0].league.id,
                        teamId: row.teamId
                      }
                    }"
                    >{{ row[col.key] }}</router-link
                  >
                </div>
                <div v-else>
                  {{ row[col.key] }}
                </div>
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
        <div class="slider-links">
          <button
            class="prev"
            v-on:click="changePage(--page, $event)"
            v-if="page > 0"
          >
            Previous
          </button>
          <button class="next" v-on:click="changePage(++page, $event)">
            Next
          </button>
        </div>
      </section>
      <div class="row align-items-center profile-header">
        <div class="col-md">
          <LeagueRules
            :leagueId="playerCalculatedScores[0].league.id"
          ></LeagueRules>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped lang="scss">
h2 {
  margin-bottom: 0;
}
.card-body {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.team-info {
  margin-bottom: 1em;
}
ul {
  margin-bottom: 0;
}
li {
  span {
    font-weight: bold;
  }
}
.player-info {
  text-decoration: none;
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
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
import { QUERY_GET_CALCULATED_SCORES } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_SCORING_TYPES_FOR_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_GET_LEAGUEPOSITIONS } from "../constants/graphQLqueries/graphQLqueries";
import { GET_FANTASY_PLAYERS_FOR_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
import LeagueRules from "../components/LeagueRules";

var getScoringData = function (scoring, id) {
  var i;
  for (i = 0; i < scoring.length; i++) {
    if (scoring[i].scoringType.id == id) {
      return scoring[i];
    }
  }
  return null;
};

import Multiselect from "vue-multiselect";
export default {
  name: "team",
  components: {
    LeagueRules,
    Multiselect
  },
  data() {
    return {
      ascending: false,
      players: this.computedData,
      playerCalculatedScores: null,
      loading: 0,
      orderBy: "score",
      page: 0,
      pageSize: 20,
      descending: true,
      positionOptions: [],
      positions: []
    };
  },
  computed: {
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
        key: "teamName",
        label: "Team"
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
        key: "numberOfSelectedByTeams",
        label: "Picked"
      });
      return field;
    },
    computedData() {
      const data = [];
      this.playerCalculatedScores.forEach((x) => {
        var row = {};
        row.fullName = x.player.fullName;
        row.teamId = x.playerSeason.team.id;
        row.teamName = x.playerSeason.team.name;
        row.position = x.playerSeason.positionType.shortName;
        row.score = x.score;
        row.todaysScore = x.todaysScore;

        if (this.playerIsOnUsersTeam(x.player.id)) {
          row.rowColor = "table-success";
          row.fullName = " # " + x.player.fullName;
        }
        if (x.playerSeason.teamStateForSeason.gameState === 1) {
          row.teamName = " + " + x.playerSeason.team.name;
        }
        if (x.playerSeason.teamStateForSeason.gameState === -1) {
          row.teamName = " * " + x.playerSeason.team.name;
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
        row.numberOfSelectedByTeams = x.numberOfSelectedByTeams;
        data.push(row);
        this.players = data;
      });
      return data;
    },
    skipPosition() {
      return this.page * this.pageSize;
    },
    selectedPositions() {
      const pos = [];
      this.positions.forEach((p) => {
        pos.push(p.id.toString());
      });
      return pos;
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
      return 0;
    },
    changePage(newPage, e) {
      e.preventDefault();
      return false;
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
  props: ["id"],
  apollo: {
    playerCalculatedScores: {
      query: QUERY_GET_CALCULATED_SCORES,
      variables() {
        return {
          leagueId: this.id.toString(),
          positionTypes: this.selectedPositions,
          take: this.pageSize,
          skip: this.skipPosition,
          orderBy: this.orderBy,
          descending: this.descending
        };
      },
      result() {
        if (this.playerCalculatedScores == null) {
          return;
        }
        if (this.playerCalculatedScores[0].league.isLocked == false) {
          this.$router.push({ name: "unauthorized" });
        }
        this.computedData;
      },
      skip() {
        return this.selectedPositions.length == 0;
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
    leagues: {
      query: QUERY_GET_LEAGUEPOSITIONS,
      variables() {
        return {
          leagueId: this.id
        };
      },
      result() {
        if (this.leagues == null) {
          return;
        }
        this.positions = [];
        this.positionOptions = [];
        this.leagues[0].season.sport.positionTypes.forEach((p) => {
          if (p.id > 1) {
            var row = {
              id: p.id,
              name: p.name
            };
            this.positions.push(row);
            this.positionOptions.push(row);
          }
        });
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
