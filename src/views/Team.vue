<template>
  <div class="container">
    <div v-if="loading" class="text-center h3"> 
      Loading... <font-awesome-icon :icon="[ 'fas', 'snowflake']" spin/>
    </div>
    <div v-else v-for="(team, idx) in fantasyTeams" :key="idx">
      <div v-if="!team.isPaid">
        Team Not Paid For
      </div>
      <div v-else>
        <PageSummary :headline="team.name">
          <p>
            Enable
            <router-link :to="{ name: 'pushInfo' }"
              >push notifications</router-link
            >
            to enhance your experience.
          </p>
        </PageSummary>
        <div class="col-md team-info">
          <div class="card">
            <div class="card-body">
              <ul>
                <li>
                  <span>League:</span>
                  &nbsp;
                  <router-link
                    class="card-links"
                    :to="{ name: 'league', params: { id: team.league.id } }"
                  >
                    {{ team.league.name }}
                  </router-link>
                </li>
                <li><span>League Ranking:</span> {{ team.rank }}</li>
                <li><span>Total Points:</span> {{ team.score }}</li>
                <li><span>Today's Points:</span> {{ team.todaysScore }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col mb-2">
            <div class="font-weight-bold">
                Color Key:
            </div>
            <div>
                <table>
                    <tr class="onTeam">
                        <td class="font-weight-bold">
                          Green:
                        </td>
                        <td>
                          * Team playing today
                        </td>
                    </tr>
                    <tr class="invalid">
                        <td class="font-weight-bold">
                          Red:
                        </td>
                        <td>
                          Team Eliminated
                        </td>
                    </tr>
                    <tr class="sorted">
                        <td class="font-weight-bold">
                          Yellow:
                        </td>
                        <td>
                          Sorted by
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <section class="col-md">
          <table class="table table-responsive-md table-bordered cf">
            <thead class="cf">
              <tr>
                <th
                  v-for="(col, colID) in computedFields"
                  :key="colID"
                  v-on:click="sortTable(col.key)"
                  :class="{ sorted: col.key === sortColumn }"
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
                        params: { id: team.league.id, teamId: row.teamId }
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
        </section>
        <LeagueRules :leagueId="team.league.id"></LeagueRules>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.team-info {
  margin-bottom: 1em;
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
}
table th,
table td {
  cursor: pointer;
  padding: 0.25em;
}
.sorted {
    background-color : #fff38c;
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

.invalid {
    background-color: #fe7669;
    pointer-events: none;
    cursor: default;
}
.onTeam {
    background-color: lightgreen;
    pointer-events: none;
    cursor: default;
}
</style>

<script>
import { QUERY_TEAM } from "../constants/graphQLqueries/graphQLqueries";
import { QUERY_SCORING_TYPES_FOR_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
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
  name: "team",
  components: {
    LeagueRules,
    PageSummary
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
        row.teamId = x.playerSeason.team.id;
        row.teamName = x.playerSeason.team.name;
        row.position = x.playerSeason.positionType.shortName;
        row.score = x.playerCalculatedScore.score;
        row.todaysScore = x.playerCalculatedScore.todaysScore;
        if (x.playerSeason.teamStateForSeason.gameState === 1) {
          row.rowColor = "onTeam";
          row.teamName = x.playerSeason.team.name;
        }
        if (x.playerSeason.teamStateForSeason.gameState === -1) {
          row.rowColor = "invalid";
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
        data.sort((a, b) => {
          if (a.teamName.startsWith(" * ")) {
            if (b.teamName.startsWith(" * ")) {
              return a.teamName > b.teamName ? 1 : -1;
            }
            return 1;
          }
          if (b.teamName.startsWith(" * ")) {
            return -1;
          }
          return a.teamName > b.teamName ? 1 : -1;
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
        let presort = 0;
        if (typeof a[col] === "string" || a[col] instanceof String) {
          const astr = a[col];
          const bstr = b[col];
          if (astr.startsWith(" * ")) {
            if (bstr.startsWith(" * ")) {
              presort = 0;
            } else {
              presort = 1;
            }
          } else if (bstr.startsWith(" * ")) {
            presort = -1;
          }
        }

        if (presort != 0) {
          return ascending ? presort : presort * -1;
        }
        if (a[col] > b[col]) {
          return ascending ? 1 : -1;
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1;
        }
        return 0;
      });
    }
  },
  props: ["id"],
  apollo: {
    fantasyTeams: {
      query: QUERY_TEAM,
      variables() {
        return {
          teamid: Number(this.id)
        };
      },
      pollInterval: 60000,
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
      query: QUERY_SCORING_TYPES_FOR_LEAGUE,
      fetchPolicy: 'cache-first',
      variables() {
        return {
          teamId: Number(this.id)
        };
      }
    }
  }
};
</script>
