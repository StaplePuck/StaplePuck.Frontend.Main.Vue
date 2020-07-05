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
      <b-table
        striped
        :items="leagueScores.fantasyTeams"
        :fields="fields"
        :sort-by.sync="sortBy"
        :small="true"
      >
        <template v-slot:cell(name)="{ item, value }">
          <div v-if="leagueScores.isLocked">
            <div v-if="!item.isPaid">Team Not Paid For</div>
            <router-link v-else :to="{ name: 'team', params: { id: item.id } }"
              >{{ value }}
            </router-link>
          </div>
          <div v-else-if="$store.getters['auth/canEditTeam'](item.id, id)">
            <router-link :to="{ name: 'editTeam', params: { id: item.id } }"
              >{{ value }}
            </router-link>
          </div>
          <div v-else>
            {{ value }}
          </div>
        </template>
        <template v-slot:cell(score)="{ item, value }">
          <div v-if="item.isPaid || !leagueScores.isLocked">
            {{ value }}
          </div>
        </template>
        <template v-slot:cell(todaysScore)="{ item, value }">
          <div v-if="item.isPaid || !leagueScores.isLocked">
            {{ value }}
          </div>
        </template>
        <template v-slot:cell(gM.name)="{ item, value }">
          <div v-if="item.isPaid || !leagueScores.isLocked">
            {{ value }}
          </div>
        </template>
      </b-table>
      <div v-if="fantasyTeamsNotPaid">
        <h4>Teams Not Paid For</h4>
        <b-table
          striped
          :items="fantasyTeamsNotPaid"
          :fields="notPaidFields"
          :sort-by.sync="sortBy"
          :small="true"
        >
        </b-table>
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
.league-info {
  margin: 1em;
}
.table th {
  cursor: pointer;
}
td {
  a {
    text-align: left;
    text-decoration: underline;
  }
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
      sortBy: "rank",
      fields: [
        {
          key: "name",
          label: "Team",
          sortable: true
        },
        {
          key: "rank",
          sortable: true,
          sortDirection: "asc"
        },
        {
          key: "score",
          label: "Total Score",
          sortable: true
        },
        {
          key: "todaysScore",
          label: "Today's Score",
          sortable: true
        },
        {
          key: "gM.name",
          label: "Team GM",
          sortable: true
        }
      ],
      notPaidFields: [
        {
          key: "name",
          label: "Team",
          sortable: true
        },
        {
          key: "gM.name",
          label: "Team GM",
          sortable: true
        }
      ],
      leagues: {},
      loading: 0
    };
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
    }
  },
  apollo: {
    leagueScores: {
      query: QUERY_SCORES_IN_LEAGUE,
      variables() {
        return {
          leagueid: this.id
        };
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
