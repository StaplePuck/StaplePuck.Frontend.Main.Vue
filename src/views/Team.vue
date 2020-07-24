<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
      <div v-if="!team.isPaid">
        Team Not Paid For
      </div>
      <div v-else class="align-items-center profile-header">
        <div class="col-md team-info">
          <div class="card text-left">
            <div class="card-header">
              <h2>{{ team.name }}</h2>
            </div>
            <div class="card-body">
               <ul>
                <li>
                  League Ranking: {{ team.rank }}
                </li>
                <li>
                  Total Score: {{ team.score }}
                </li>
                <li>
                  Today's Score: {{ team.todaysScore }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <section id="scroll-table" class="col-md">
          <table class="table table-bordered table-striped table-condensed cf" id="fifthTable">
            <thead class="cf"> 
              <tr>
                <th v-for="(col, colID) in computedFields" :key="colID">{{col.label}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowID) in computedData" :key="rowID" v-bind:class="row.rowColor">
                <td v-for="(col, colID) in computedFields" :key="colID">{{row[col.key]}}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h2 {
  margin-bottom: 0;
  text-align: left;
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
  data() {
    return {
      sortBy: "teamName",
      fantasyTeams: null,
      loading: 0
    };
  },
  computed: {
    computedFields() {
      const field = [];
      field.push({
        key: "fullName",
        label: "Player",
        sortable: true
      });
      field.push({
        key: "score",
        label: "Total Points",
        sortable: true
      });
      field.push({
        key: "todaysScore",
        label: "Today's Points",
        sortable: true
      });
      field.push({
        key: "teamName",
        label: "Team",
        sortable: true,
        sortDirection: "asc"
      });
      field.push({
        key: "position",
        label: "Position",
        sortable: true
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
        if (x.playerSeason.teamStateForSeason.gameState === 1) row.rowColor = "table-success";
        if (x.playerSeason.teamStateForSeason.gameState === -1) row.rowColor = "table-danger";

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
      });
      return data;
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
