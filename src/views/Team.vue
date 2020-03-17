<template>
  <div class="container">
    <h4 v-if="loading">Loading...</h4>
    <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
      <div class="row align-items-center profile-header">
        <div class="col-md text-center">
          <h2>{{ team.name }}</h2>
          League Ranking: {{ team.rank }}<br />
          Total Score: {{ team.score }}<br />
          Today's Score: {{ team.todaysScore }}<br />
        </div>
        <b-table
          striped
          :items="computedData"
          :fields="computedFields"
          :sort-by.sync="sortBy"
          :tbody-tr-class="rowClass"
        >
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { QUERY_TEAM } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_SCORING_TYPES_FOR_TEAM } from "../constants/graphQLqueries/graphQLqueries";

var getScoringData = function(scoring, id) {
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
      this.scoringTypeHeadersForTeam.forEach(x => {
        field.push({
          key: "score" + x.id,
          label: x.shortName
        });
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
      return field;
    },
    computedData() {
      const data = [];
      this.fantasyTeams[0].fantasyTeamPlayers.forEach(x => {
        var row = {};
        row.fullName = x.player.fullName;
        row.teamName = x.playerSeason.team.name;
        row.position = x.playerSeason.positionType.shortName;
        row.teamState = x.playerSeason.teamStateForSeason.gameState;
        row.score = x.playerCalculatedScore.score;
        row.todaysScore = x.playerCalculatedScore.todaysScore;

        this.scoringTypeHeadersForTeam.forEach(s => {
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
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.teamState === 1) return "table-success";
      if (item.teamState === -1) return "table-danger";
    }
  }
};
</script>
