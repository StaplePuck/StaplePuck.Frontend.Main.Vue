<template>
  <div class="container">
    <div v-for="(team, idx) in fantasyTeams" :key="idx">
      <div class="row align-items-center profile-header">
        <div class="col-md text-center">
          <h2>{{ team.name }}</h2>
          League Ranking: {{ team.rank }}<br />
          Total Score: {{ team.score }}<br />
          Today's Score: {{ team.todaysScore }}<br />
        </div>
        <b-table
          striped
          :items="team.fantasyTeamPlayers"
          :fields="fields"
          :sort-by.sync="sortBy"
        >
          <template v-slot:cell(name)="{ item, value }">
            <div v-if="league.isLocked == true">
              <router-link :to="{ name: 'team', params: { id: item.id } }">{{
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
import { QUERY_TEAM } from "../constants/graphQLqueries/graphQLqueries";

export default {
  name: "team",
  data() {
    return {
      sortBy: "team",
      fields: [
        {
          key: "player.fullName",
          label: "Player",
          sortable: true
        },
        {
          key: "playerSeason.team.name",
          label: "Team",
          sortable: true,
          sortDirection: "asc"
        },
        {
          key: "playerSeason.positionType.shortName",
          label: "Position",
          sortable: true
        },
        {
          key: "playerCalculatedScore.score",
          label: "Total Points",
          sortable: true
        },
        {
          key: "playerCalculatedScore.todaysScore",
          label: "Today's Points",
          sortable: true
        }
      ],
      fantasyTeams: {}
    };
  },
  props: ["id"],
  apollo: {
    fantasyTeams: {
      query: QUERY_TEAM,
      variables() {
        return {
          teamid: this.id
        };
      }
    }
  }
};
</script>
