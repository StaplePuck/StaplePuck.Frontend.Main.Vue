<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
      <div v-if="!team.isPaid">
        Team Not Paid For
      </div>
      <div v-else class="align-items-center profile-header">
        <div class="col-md team-info">
          <div class="card">
            <div class="card-header">
              <h2>{{ team.name }}</h2>
            </div>
            <div class="card-body">
               <ul>
                 <li>
                  <span>League:</span>
                  <router-link :to="{ name: 'league', params: { id: team.league.id } }">
                    {{ team.league.name }}
                  </router-link>
                </li>
                <li>
                  <span>League Ranking:</span> {{ team.rank }}
                </li>
                <li>
                  <span>Total Points:</span> {{ team.score }}
                </li>
                <li>
                  <span>Today's Points:</span> {{ team.todaysScore }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md team-info">
          <span class="player-info table-danger">* = Team Eliminated</span>
          <br/>
          <span class="player-info table-success">+ = Team in Play Today</span>
        </div>
        <section id="scroll-table" class="col-md">
          <table class="table table-bordered table-condensed cf">
            <thead class="cf"> 
              <tr>
                <th v-for="(col, colID) in computedFields" :key="colID" v-on:click="sortTable(col.key)">
                  {{col.label}}
                </th>
              </tr>
            </thead>
            <tbody v-if="players">
              <tr v-for="(row, rowID) in players" :key="rowID" v-bind:class="row.rowColor">
                <td v-for="(col, colID) in computedFields" :key="colID">{{row[col.key]}}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="(row, rowID) in computedData" :key="rowID" v-bind:class="row.rowColor">
                <td v-for="(col, colID) in computedFields" :key="colID">{{row[col.key]}}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <div class="row align-items-center profile-header">
          <div class="col-md">
            <LeagueRules :leagueId="team.league.id"></LeagueRules>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
a {
    color: darkblue;
}
.player-info {
    text-decoration: none;
    padding-right: 0.6em;
    padding-left: 0.6em;
    border-radius: 10rem;
}
table th, table td {
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
	
	#scroll-table.cf:after { visibility: hidden; display: block; font-size: 0; content: " "; clear: both; height: 0; }
	#scroll-table * html .cf { zoom: 1; }
	#scroll-table *:first-child+html .cf { zoom: 1; }
	
	#scroll-table table { width: 100%; border-collapse: collapse; border-spacing: 0; }
 
	#scroll-table th,
	#scroll-table td { margin: 0; vertical-align: top; }
	#scroll-table th { text-align: left; }
	
	#scroll-table table { display: block; position: relative; width: 100%; }
	#scroll-table thead { display: block; float: left; }
	#scroll-table tbody { display: block; width: auto; position: relative; overflow-x: auto; white-space: nowrap; }
	#scroll-table thead tr { display: block; }
	#scroll-table th { display: block; text-align: right; }
	#scroll-table tbody tr { display: inline-block; vertical-align: top; }
	#scroll-table td { display: block; min-height: 1.25em; text-align: left; }

	/* sort out borders */
	#scroll-table th { border-bottom: 0; border-left: 0; }
	#scroll-table td { border-left: 0; border-right: 0; border-bottom: 0; }
	#scroll-table tbody tr { border-left: 1px solid #babcbf; }
	#scroll-table th:last-child,
	#scroll-table td:last-child { border-bottom: 1px solid #babcbf; }
}
</style>

<script>
import { QUERY_TEAM } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_SCORING_TYPES_FOR_TEAM } from "../constants/graphQLqueries/graphQLqueries";
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

export default {
  name: "team",
  components: {
    LeagueRules
  },
  data() {
    return {
      ascending: false,
      sortColumn: "teamName",
      players: this.computedData, 
      fantasyTeams: null,
      loading: 0
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
      return field;
    },
    computedData() {
      const data = [];
      this.fantasyTeams[0].fantasyTeamPlayers.forEach((x) => {
        var row = {};
        row.fullName = x.player.fullName;
        row.teamName = x.playerSeason.team.name;
        row.position = x.playerSeason.positionType.shortName;
        row.score = x.playerCalculatedScore.score;
        row.todaysScore = x.playerCalculatedScore.todaysScore;
        if (x.playerSeason.teamStateForSeason.gameState === 1) {
          row.rowColor = "table-success";
          row.teamName = " + " + x.playerSeason.team.name;
        }
        if (x.playerSeason.teamStateForSeason.gameState === -1) {
          row.rowColor = "table-danger";
          row.teamName = " * " + x.playerSeason.team.name;
        }

        this.scoringTypeHeadersForTeam.forEach((s) => {
          var text = "0";
          var scoringData = getScoringData(
            x.playerCalculatedScore.scoring,
            s.id
          );
          if (scoringData != null) {
            text = scoringData.score;
            if (scoringData.todaysScore > 0) {
              text += " (" + scoringData.todaysScore + ")";
            }
          }
          row["score" + s.id] = text;
        });

        data.push(row);
        data.sort((a, b) => (a.teamName > b.teamName) ? 1 : -1)
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
      this.computedData.sort(function(a, b) {
        if (a[col] > b[col]) {
          return ascending ? 1 : -1
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1
        }
        return 0;
      })
    }
  },
  props: ["id"],
  apollo: {
    fantasyTeams: {
      query: QUERY_TEAM,
      variables() {
        return {
          teamid: this.id
        };
      },
      result() {
        if (this.fantasyTeams == null) {
          return;
        }
        if (this.fantasyTeams[0].league.isLocked == false) {
          this.$router.push({ name: "unauthorized" });
        }
      }
    },
    scoringTypeHeadersForTeam: {
      query: QUERY_SCORING_TYPES_FOR_TEAM,
      variables() {
        return {
          teamid: this.id
        };
      }
    }
  }
};
</script>
