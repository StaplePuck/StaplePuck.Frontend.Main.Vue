<template>
  <div class="container">
    <h4 v-if="loading">Loading...</h4>
    <div v-else v-for="(league, idx) in leagues" :key="idx">
      <div class="row align-items-center profile-header">
        <div class="col-md text-center">
          <h2>{{ league.name }}</h2>
          <p>{{ league.announcement }}</p>
        </div>
        <div class="container">
          <div v-if="league.isLocked == false">
            <div v-if="!$store.state.userIsAuthorized">
              Log in to join this league or edit your team.
            </div>
            <div v-else-if="league.allowMultipleTeams">
              <b-button
                class="join"
                :to="{ name: 'newTeam', params: { id: id } }"
                >Join League</b-button
              >
            </div>
            <div v-else-if="canJoin">Join</div>
          </div>
          <div v-else>
            League is locked
          </div>
        </div>
        <b-table
          striped
          :items="league.fantasyTeams"
          :fields="fields"
          :sort-by.sync="sortBy"
          :small="true"
        >
          <template v-slot:cell(name)="{ item, value }">
            <div v-if="league.isLocked == true">
              <router-link :to="{ name: 'team', params: { id: item.id } }">{{
                value
              }}</router-link>
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
        </b-table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.join {
  margin: 0.5em;
}
</style>

<script>
import { QUERY_TEAMS_IN_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";
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
      leagues: {},
      loading: 0
    };
  },
  props: ["id"],
  computed: {
    canJoin: function() {
      if (this.leagues[0].allowMultipleTeams) {
        return true;
      }
      const sub = localStorage.getItem("user_sub");
      var i;
      for (i = 0; i < this.leagues[0].fantasyTeams.length; i++) {
        if (this.leagues[0].fantasyTeams[i].gM.externalId == sub) {
          return false;
        }
      }
      return true;
    }
  },
  methods: {
    canEditTeam: function(teamId) {
      const scope = localStorage.getItem("user_scope");
      return (
        UserIsLeagueOwner(this.leagues[0].id, scope) ||
        UserIsTeamOwner(teamId, scope)
      );
    }
  },
  apollo: {
    leagues: {
      query: QUERY_TEAMS_IN_LEAGUE,
      variables() {
        return {
          leagueid: this.id
        };
      }
    }
  }
};
</script>
