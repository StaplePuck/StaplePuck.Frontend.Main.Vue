<template>
  <div class="container">
    <div v-for="(league, idx) in leagues" :key="idx">
      <div class="row align-items-center profile-header">
        <div class="col-md text-center">
          <h2>{{ league.name }}</h2>
          <p>{{ league.announcement }}</p>
        </div>
        <b-table
          striped
          :items="league.fantasyTeams"
          :fields="fields"
          :sort-by.sync="sortBy"
        >
          <template v-slot:cell(name)="{ item, value }">
            <div v-if="league.isLocked == true">
              <router-link :to="{ name: 'league', params: { id: item.id } }">{{
                value
              }}</router-link>
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

<script>
import { QUERY_TEAMS_IN_LEAGUE } from "../constants/graphQLqueries/graphQLqueries";

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
      leagues: {}
    };
  },
  props: ["id"],
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
