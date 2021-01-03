<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else v-for="(league, idx) in leagues" :key="idx">
      <div class="container">
        <form @submit="updateLeague" class="form-width">
          <div class="form-group">
            <label label-for="leagueName">League Name:</label>
            <input
              type="text"
              id="leagueName"
              class="form-control"
              required
              trim
              v-model="league.name"
            />
          </div>
          <div class="form-group">
            <label label-for="description">Description:</label>
            <input
              type="text"
              id="description"
              class="form-control"
              trim
              v-model="league.description"
            />
          </div>
          <div class="form-group">
            <label label-for="announcement">Announcement:</label>
            <input
              type="text"
              id="announcement"
              class="form-control"
              trim
              v-model="league.announcement"
            />
          </div>
          <div class="form-group">
            <label label-for="paymentInfo">Payment Info:</label>
            <input
              type="text"
              id="paymentInfo"
              class="form-control"
              trim
              v-model="league.paymentInfo"
            />
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="allowMultipleTeams"
              unchecked-value="false"
              v-model="league.allowMultipleTeams"
            />
            <label class="form-check-label" for="allowMultipleTeams"
              >Allow Multiple Teams</label
            >
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="active"
              unchecked-value="false"
              v-model="league.isActive"
            />
            <label class="form-check-label" for="active">Active</label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="locked"
              unchecked-value="false"
              v-model="league.isLocked"
            />
            <label class="form-check-label" for="locked">Locked</label>
          </div>
          <table class="table table-bordered table-striped table-condensed cf">
            <thead class="cf">
              <tr>
                <th
                  v-for="(col, colID) in fields"
                  :key="colID"
                  v-on:click="sortTable(col.key)"
                >
                  <span>{{ col.label }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
            <tr
              v-for="(row, rowID) in league.fantasyTeams"
              :key="rowID"
            >
              <td>
                <div v-if="league.isLocked">
                  <router-link
                    :to="{ name: 'team', params: { id: row.id } }"
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
                <div>
                  {{ row.gM.name }}
                </div>
              </td>
              <td>
                <div>
                  {{ row.gM.email }}
                </div>
              </td>
              <td>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input position-static"
                    unchecked-value="false"
                    disabled
                    v-model="row.isValid"
                    aria-label="Checked if the team is valid"
                  />
                </div>
              </td>
              <td>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input position-static"
                    unchecked-value="false"
                    v-model="row.isPaid"
                    aria-label="Checked if the user has paid"
                  />
                </div>
              </td>
            </tr>
          </tbody>
          </table>
          <div v-show="saveSuccess" class="alert alert-success">
            Save Successful
          </div>
          <div v-show="saveFailed" class="alert alert-danger">
            <p
              v-for="(thisError, index) in saveErrors"
              :key="`saveErrors-${index}`"
            >
              {{ thisError }}
            </p>
          </div>
          <button
            class="btn btn-secondary a-button"
            type="submit"
            :disabled="saving === 1"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="saving === 1"
            ></span>
            Save
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.join {
  margin: 0.5em;
}
label {
  margin-bottom: 0;
  font-weight: bold;
}
.table th {
  cursor: pointer;
  padding: 0.25em;
}
.table td {
  cursor: pointer;
  padding: 0.25em;
}
td {
  a {
    color: darkblue;
    text-align: left;
    text-decoration: underline;
  }
}
</style>

<script>
import {
  QUERY_TEAMS_FOR_MANAGE,
  UPDATE_LEAGUE_INFO
} from "../constants/graphQLqueries/graphQLqueries";
import { DisplayErrors } from "../serverInputErrors";

export default {
  name: "leagueManage",
  data() {
    return {
      validCollection: {},
      fields: [
        {
          key: "name",
          label: "Team"
        },
        {
          key: "gM.name",
          label: "Team GM"
        },
        {
          key: "gM.email",
          label: "Email"
        },
        {
          key: "isValid",
          label: "Valid"
        },
        {
          key: "isPaid",
          label: "Paid"
        }
      ],
      leagues: {},
      loading: 0,
      saving: 0,
      saveSuccess: false,
      saveFailed: false,
      saveErrors: {}
    };
  },
  props: ["id"],
  apollo: {
    leagues: {
      query: QUERY_TEAMS_FOR_MANAGE,
      variables() {
        return {
          leagueid: this.id
        };
      },
      result({ data }) {
        var i;
        if (this.leagues == null || this.leagues[0] == null) {
          return;
        }
        if (!this.$store.getters["auth/userIsLeagueOwner"](this.id)) {
          this.$router.push({ name: "unauthorized" });
        }
        if (data) {
          data.leagues[0].fantasyTeams.sort((a, b) =>
            a.name > b.name ? 1 : -1
          );
        }
        for (i = 0; i < this.leagues[0].fantasyTeams.length; i++) {
          var ft = this.leagues[0].fantasyTeams[i];
          this.validCollection[ft.id] = ft.isValid;
        }
      }
    }
  },
  ascending: true,
  sortColumn: "name",
  methods: {
    sortTable(col) {
      if (this.sortColumn === col) {
        this.ascending = !this.ascending;
      } else {
        this.ascending = true;
        this.sortColumn = col;
      }

      var ascending = this.ascending;
      this.leagues[0].fantasyTeams.sort(function (a, b) {
        if (a[col] > b[col]) {
          return ascending ? 1 : -1;
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1;
        }
      });
    },
    updateLeague(evt) {
      evt.preventDefault();
      this.saving = 1;
      this.saveSuccess = false;
      this.saveFailed = false;

      var fantasyTeams = [];
      var i;
      for (i = 0; i < this.leagues[0].fantasyTeams.length; i++) {
          var ft = this.leagues[0].fantasyTeams[i];
          fantasyTeams.push({ id: ft.id, isPaid: ft.isPaid });
        }
      this.$apollo
        .mutate({
          mutation: UPDATE_LEAGUE_INFO,
          variables: {
            league: {
              id: this.id,
              name: this.leagues[0].name,
              description: this.leagues[0].description,
              announcement: this.leagues[0].announcement,
              paymentInfo: this.leagues[0].paymentInfo,
              allowMultipleTeams: this.leagues[0].allowMultipleTeams,
              isActive: this.leagues[0].isActive,
              isLocked: this.leagues[0].isLocked,
              fantasyTeams: fantasyTeams
            }
          }
        })
        .then(() => {
          this.saveFailed = false;
          this.saveSuccess = true;
          this.saving = 0;
        })
        .catch((error) => {
          this.saveSuccess = false;
          this.saveFailed = true;
          this.saveErrors = DisplayErrors(this.$bvToast, error);
          this.saving = 0;
        });
    }
  }
};
</script>
