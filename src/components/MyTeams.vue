<template>
  <div>
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else>
      <div class="table-responsive-md col-md hideLeague">
        <h2>Active</h2>
        <table class="table table-bordered table-striped table-condensed cf">
          <thead class="cf">
            <tr>
              <th v-for="(col, colID) in activeFields" :key="colID">
                <span>{{ col.label }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowID) in activeTeams" :key="rowID">
              <td>
                <router-link
                  :to="{ name: 'league', params: { id: row.league.id } }"
                >
                  {{ row.league.name }}
                </router-link>
              </td>
              <td>
                <div v-if="row.league.isLocked">
                  <router-link :to="{ name: 'team', params: { id: row.id } }"
                    >{{ row.name }}
                  </router-link>
                </div>
                <div v-else>
                  <router-link
                    :to="{ name: 'editTeam', params: { id: row.id } }"
                    >{{ row.name }}
                  </router-link>
                </div>
              </td>
              <td>
                <router-link
                  :to="{ name: 'league', params: { id: row.league.id } }"
                >
                  {{ row.rank }}
                </router-link>
              </td>
              <td>
                <div v-if="row.isPaid || !row.league.isLocked">
                  {{ row.score }}
                </div>
              </td>
              <td>
                <div v-if="row.isPaid || !row.league.isLocked">
                  {{ row.todaysScore }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Archived</h2>
      <div class="table-responsive-md col-md">
        <table class="table table-bordered table-striped table-condensed cf">
          <thead class="cf">
            <tr>
              <th v-for="(col, colID) in nonActiveFields" :key="colID">
                <span>{{ col.label }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowID) in nonActiveTeams" :key="rowID">
              <td>
                <router-link
                  :to="{ name: 'league', params: { id: row.league.id } }"
                >
                  {{ row.league.name }}
                </router-link>
              </td>
              <td>
                <div v-if="row.league.isLocked">
                  <router-link :to="{ name: 'team', params: { id: row.id } }"
                    >{{ row.name }}
                  </router-link>
                </div>
                <div v-else>
                  <router-link
                    :to="{ name: 'editTeam', params: { id: row.id } }"
                    >{{ row.name }}
                  </router-link>
                </div>
              </td>
              <td>
                <router-link
                  :to="{ name: 'league', params: { id: row.league.id } }"
                >
                  {{ row.rank }}
                </router-link>
              </td>
              <td>
                <div v-if="row.isPaid || !row.league.isLocked">
                  {{ row.score }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { GET_MY_FANTASY_TEAMS } from "../constants/graphQLqueries/graphQLqueries";

export default {
  name: "MyTeams",
  data() {
    return {
      loading: 0,
      activeTeams: null,
      notActiveTeams: null,
      activeFields: [
        {
          key: "league.name",
          label: "League"
        },
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
          label: "Points"
        },
        {
          key: "todaysScore",
          label: "Points Today"
        }
      ],
      nonActiveFields: [
        {
          key: "league.name",
          label: "League"
        },
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
          label: "Points"
        }
      ]
    };
  },
  apollo: {
    myFantasyTeams: {
      query: GET_MY_FANTASY_TEAMS,
      result() {
        if (this.myFantasyTeams == null) {
          return;
        }
        this.activeTeams = [];
        this.nonActiveTeams = [];
        this.myFantasyTeams.forEach((x) => {
          if (x.league.isActive) {
            this.activeTeams.push(x);
          } else {
            this.nonActiveTeams.push(x);
          }
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
h2 {
  margin-bottom: 0;
}
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
  .hideLeague {
    table td:nth-child(5),
    table th:nth-child(5) {
      display: none;
    }
    table th:nth-child(4) {
      span {
        display: none;
      }
    }
    table th:nth-child(4) {
      span {
        display: none;
      }
    }
    table th:nth-child(4):after {
      content: "Pts";
    }
  }
}
</style>
