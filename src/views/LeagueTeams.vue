<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else>
      <div class="col-md league-info">
        <div class="card text-left">
          <div class="card-header">
            <h2>{{ leagueScores.name }}</h2>
          </div>
          <div class="card-body">
              <span v-if="leagueScores.announcement != ''" style="color: darkred;">
                <b>{{ leagueScores.announcement }}</b>
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
                This leauge is locked
              </div>
              <div v-if="$store.getters['auth/userIsLeagueOwner'](id)" class="text-center">
                <router-link
                  class="btn btn-secondary a-button text-center"
                  :to="{ name: 'leagueManage', params: { id: id } }"
                  >Manage This League
                </router-link>
              </div>
          </div>
        </div>
      </div>
      <section id="scroll-table" class="col-md scroll-table">
        <table class="table table-bordered table-striped table-condensed cf">
          <thead class="cf"> 
            <tr>
              <th v-for="(col, colID) in fields" :key="colID" v-on:click="sortTable(col.key)" v-on:load="sortTable(col.key)">{{col.label}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowID) in leagueScores.fantasyTeams" :key="rowID">
              <td>
                <div v-if="leagueScores.isLocked">
                  <div v-if="!row.isPaid">Team Not Paid For</div>
                  <router-link v-else :to="{ name: 'team', params: { id: row.id } }"
                    >{{ row.name }}
                  </router-link>
                </div>
                <div v-else-if="$store.getters['auth/canEditTeam'](row.id, id)">
                  <router-link :to="{ name: 'editTeam', params: { id: row.id } }"
                    >{{ row.name }}
                  </router-link>
                </div>
                <div v-else>
                  {{ row.name }}
                </div>
              </td>
              <td>
                {{row.rank}}
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
                  {{ row.gM.name}}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section v-if="fantasyTeamsNotPaid" id="not-pad-table" class="col-md scroll-table">
        <h4>Teams Not Paid For</h4>
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
              <td>{{row.name}}</td>
              <td>{{row.gM.name}}</td>
            </tr>
          </tbody>
        </table>
      </section>
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
.league-info {
  margin-bottom: 1em;
}
.table th {
  cursor: pointer;
}
td {
  a {
    color: darkblue;
    text-align: left;
    text-decoration: underline;
  }
}

@media only screen and (max-width: 800px) {

  #not-pad-table.cf:after { visibility: hidden; display: block; font-size: 0; content: " "; clear: both; height: 0; }
	#not-pad-table * html .cf { zoom: 1; }
	#not-pad-table *:first-child+html .cf { zoom: 1; }
	
	#scroll-table.cf:after { visibility: hidden; display: block; font-size: 0; content: " "; clear: both; height: 0; }
	#scroll-table * html .cf { zoom: 1; }
	#scroll-table *:first-child+html .cf { zoom: 1; }
	
	.scroll-table table { width: 100%; border-collapse: collapse; border-spacing: 0; }
 
	.scroll-table th,
	.scroll-table td { margin: 0; vertical-align: top; }
	.scroll-table th { text-align: left; }
	
	.scroll-table table { display: block; position: relative; width: 100%; }
	.scroll-table thead { display: block; float: left; }
	.scroll-table tbody { display: block; width: auto; position: relative; overflow-x: auto; white-space: nowrap; }
	.scroll-table thead tr { display: block; }
	.scroll-table th { display: block; text-align: right; }
	.scroll-table tbody tr { display: inline-block; vertical-align: top; }
	.scroll-table td { display: block; min-height: 1.25em; text-align: left; }

	/* sort out borders */
	.scroll-table th { border-bottom: 0; border-left: 0; }
	.scroll-table td { border-left: 0; border-right: 0; border-bottom: 0; }
	.scroll-table tbody tr { border-left: 1px solid #babcbf; }
	.scroll-table th:last-child,
	.scroll-table td:last-child { border-bottom: 1px solid #babcbf; }
}
</style>
<script>
import {
  QUERY_SCORES_IN_LEAGUE,
  QUERY_NOT_PAID
} from "../constants/graphQLqueries/graphQLqueries";

export default {
  name: "leagueTeams",
  data() {
    return {
      fields: [
        {
          key: "name",
          label: "Team"
        },
        {
          key: "rank",
          label: "Rank"
        },
        {
          key: "score",
          label: "Total Score"
        },
        {
          key: "todaysScore",
          label: "Today's Score"
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
      this.leagueScores.fantasyTeams.sort(function(a, b) {
        if (a[col] > b[col]) {
          return ascending ? 1 : -1
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1
        }
      })
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
          leagueid: this.id
        };
      },
      result ({data}) {
        if(data){
          data.leagueScores.fantasyTeams.sort((a, b) => (a.rank > b.rank) ? 1 : -1);
        }
    }
    },
    fantasyTeamsNotPaid: {
      query: QUERY_NOT_PAID,
      variables() {
        return {
          leagueid: this.id
        };
      }
    }
  }
};
</script>
