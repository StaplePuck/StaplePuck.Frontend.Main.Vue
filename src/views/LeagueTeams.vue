<template>
  <div class="container text-center">
    <h4 v-if="loading">Loading...</h4>
    <div v-else>
      <div class="col-md">
        <h2>{{ leagueScores.name }}</h2>
        <p>{{ leagueScores.announcement }}</p>
      </div>
      <div class="container">
        <div v-if="!leagueScores.isLocked">
          <div v-if="!$auth.isAuthenticated">
            Log in to join this league or edit your team.
          </div>
          <div v-else-if="canJoin">
            <router-link
              class="btn btn-secondary a-button"
              :to="{ name: 'newTeam', params: { id: id } }"
              >Join League
            </router-link>
          </div>
        </div>
        <div v-else>
          League is locked
        </div>
        <div v-if="canManageLeague">
          <router-link
            class="btn btn-secondary a-button"
            :to="{ name: 'leagueManage', params: { id: id } }"
            >Manage
          </router-link>
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
          <div v-else-if="canEditTeam(item.id)">
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

<script>
import {
  QUERY_SCORES_IN_LEAGUE,
  QUERY_NOT_PAID
} from "../constants/graphQLqueries/graphQLqueries";
import { UserIsLeagueOwner } from "../userAuthorization";
import { UserIsTeamOwner } from "../userAuthorization";

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
  asyncComputed: {
    canManageLeague: async function () {
      if (!this.$auth.isAuthenticated) {
        return false;
      }
      const token = await this.$auth.getDecodedToken();
      console.log(token.scope);
      return UserIsLeagueOwner(this.id, token.scope);
    }
  },
  computed: {
    canJoin: function () {
      if (this.leagueScores.allowMultipleTeams) {
        return true;
      }
      if (this.$auth.isAuthenticated) {
        return false;
      }
      const sub = this.$auth.user.sub;
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
  methods: {
    canEditTeam: async function (teamId) {
      if (!this.$auth.isAuthenticated) {
        return false;
      }
      const token = await this.$auth.getDecodedToken();
      return (
        UserIsLeagueOwner(this.id, token.scope) ||
        UserIsTeamOwner(teamId, token.scope)
      );
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
