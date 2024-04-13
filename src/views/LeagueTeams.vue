<template>
  <div class="container">
    <div v-if="loading" class="text-center h3"> 
      Loading... <font-awesome-icon :icon="[ 'fas', 'snowflake']" spin/>
    </div>
    <div v-else>
      <PageSummary :headline="leagueScores.name">
        <p>
          Enable
          <router-link :to="{ name: 'pushInfo' }"
            >push notifications</router-link
          >
          to enhance your experience.
        </p>
      </PageSummary>
      <div class="col-md league-info">
        <div class="card text-left">
          <div class="card-body">
            <span v-if="leagueScores.announcement != ''" class="alert-msg">
              <b v-html="leagueScores.announcement"></b>
            </span>
            <p v-if="hasNotPaid" v-html="leagueScores.paymentInfo"></p>
            <div v-if="!leagueScores.isLocked">
              <div v-if="!$auth.isAuthenticated">
                Log in to join this league or edit your team.
              </div>
              <div v-else-if="canJoin" class="text-center">
                <router-link
                  class="btn btn-secondary a-button text-center"
                  :to="{ name: 'newTeam', params: { id: id } }"
                  >Join This League
                </router-link>
              </div>
            </div>
            <div v-else>
              <router-link
                class="card-links"
                :to="{ name: 'players', params: { id: id } }"
                >Player Stats
              </router-link>
            </div>
            <div
              v-if="$store.getters['auth/userIsLeagueOwner'](id)"
              class="text-center"
            >
              <router-link
                class="btn btn-secondary a-button text-center"
                :to="{ name: 'leagueManage', params: { id: id } }"
                >Manage This League
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="table-responsive-md col-md hideGM">
        <table class="table table-bordered table-condensed cf">
          <thead class="cf">
            <tr>
              <th
                v-for="(col, colID) in fields"
                :key="colID"
                v-on:click="sortTable(col.key)"
                v-on:load="sortTable(col.key)"
              >
                <span>{{ col.label }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowID) in leagueScores.fantasyTeams"
              :key="rowID"
              v-bind:class="rowColor(row)"
            >
              <td>
                {{ row.rank }}
              </td>
              <td>
                <div v-if="leagueScores.isLocked">
                  <div v-if="!row.isPaid">Team Not Paid For</div>
                  <router-link
                    v-else
                    :to="{ name: 'team', params: { id: row.id } }"
                    >{{ row.name }}
                  </router-link>
                </div>
                <div v-else-if="canEditTeam(row)">
                  <router-link
                    :to="{ name: 'editTeam', params: { id: row.id } }"
                    >{{ row.name }}
                  </router-link>
                </div>
                <div v-else>
                  {{ row.name }}
                </div>
              </td>
              <td>
                <div v-if="row.isPaid || !leagueScores.isLocked">
                  {{ row.score }}
                </div>
              </td>
              <td>
                <div v-if="row.isPaid || !leagueScores.isLocked">
                  {{ row.todaysScore }}
                </div>
              </td>
              <td>
                <div v-if="row.isPaid || !leagueScores.isLocked">
                  {{ row.gM.name }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="fantasyTeamsNotPaid" class="table-responsive-md col-md">
        <h2>Teams Not Paid For</h2>
        <table class="table table-bordered table-condensed cf">
          <thead class="cf">
            <tr>
              <th>
                Team
              </th>
              <th>
                Team GM
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowID) in fantasyTeamsNotPaid" :key="rowID">
              <td>{{ row.name }}</td>
              <td>{{ row.gM.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.league-info {
  margin-bottom: 1em;
}
.table th {
  cursor: pointer;
  padding: 0.25em;
}
.table td {
  cursor: pointer;
  padding: 0.25em;
}

@media only screen and (max-width: 576px) {
  .hideGM {
    table td:nth-child(5),
    table th:nth-child(5) {
      display: none;
    }

    table th:nth-child(4) {
      span {
        display: none;
      }
    }

    table th:nth-child(4):after {
      content: "PtsTdy";
    }

    table th:nth-child(3) {
      span {
        display: none;
      }
    }

    table th:nth-child(3):after {
      content: "Pts";
    }
  }
}
</style>
<script>
import {
  QUERY_SCORES_IN_LEAGUE,
  QUERY_NOT_PAID
} from "../constants/graphQLqueries/graphQLqueries";
import PageSummary from "../components/PageSummary.vue";

export default {
  name: "leagueTeams",
  components: {
    PageSummary
  },
  data() {
    return {
      fields: [
        {
          key: "rank",
          label: "#"
        },
        {
          key: "name",
          label: "Team"
        },
        {
          key: "score",
          label: "Points"
        },
        {
          key: "todaysScore",
          label: "Points Today"
        },
        {
          key: "gM.name",
          label: "Team GM"
        }
      ],
      notPaidFields: [
        {
          key: "name",
          label: "Team"
        },
        {
          key: "gM.name",
          label: "Team GM"
        }
      ],
      loading: 0,
      leagueScores: {},
      fantasyTeamsNotPaid: []
    };
  },
  ascending: false,
  sortColumn: "rank",
  methods: {
    sortTable(col) {
      if (this.sortColumn === col) {
        this.ascending = !this.ascending;
      } else {
        this.ascending = true;
        this.sortColumn = col;
      }

      var ascending = this.ascending;
      this.leagueScores.fantasyTeams.sort(function (a, b) {
        if (a[col] > b[col]) {
          return ascending ? 1 : -1;
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1;
        }
      });
    },
    canEditTeam(fantasyTeam) {
      const sub = this.$store.state.auth.userSub;
      return (
        this.$store.getters["auth/canEditTeam"](fantasyTeam.id, this.id) ||
        fantasyTeam.gM.externalId == sub
      );
    },
    rowColor(fantasyTeam) {
      const sub = this.$store.state.auth.userSub;
      if (fantasyTeam.gM.externalId == sub && fantasyTeam.isPaid) {
        return "table-success";
      }
      return "";
    }
  },
  props: ["id"],
  computed: {
    canJoin: function () {
      if (this.leagueScores.allowMultipleTeams) {
        return true;
      }
      if (!this.$auth.isAuthenticated) {
        return false;
      }
      const sub = this.$store.state.auth.userSub;
      var i;
      for (i = 0; i < this.leagueScores.fantasyTeams.length; i++) {
        if (
          this.leagueScores.fantasyTeams[i].gM != null &&
          this.leagueScores.fantasyTeams[i].gM.externalId == sub
        ) {
          return false;
        }
      }
      return true;
    },
    hasNotPaid: function () {
      if (!this.$auth.isAuthenticated) {
        return false;
      }
      const sub = this.$store.state.auth.userSub;
      var i;
      for (i = 0; i < this.leagueScores.fantasyTeams.length; i++) {
        if (
          !this.leagueScores.fantasyTeams[i].isPaid &&
          this.leagueScores.fantasyTeams[i].gM != null &&
          this.leagueScores.fantasyTeams[i].gM.externalId == sub
        ) {
          return true;
        }
      }
      return false;
    }
  },
  apollo: {
    leagueScores: {
      query: QUERY_SCORES_IN_LEAGUE,
      variables() {
        return {
          leagueid: Number(this.id)
        };
      },
      result({ data }) {
        if (data) {
          data.leagueScores.fantasyTeams.sort((a, b) =>
            a.rank > b.rank ? 1 : -1
          );
        }
      }
    },
    fantasyTeamsNotPaid: {
      query: QUERY_NOT_PAID,
      variables() {
        return {
          leagueid: Number(this.id)
        };
      },
      pollInterval: 60000
    }
  }
};
</script>
