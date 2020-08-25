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
          <div></div>
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
              <div v-else>
                <router-link :to="{ name: 'editTeam', params: { id: item.id } }"
                  >{{ value }}
                </router-link>
              </div>
            </template>
            <template v-slot:cell(isValid)="{ item }">
              <div class="form-check">
                <input
                  class="form-check-input position-static"
                  type="checkbox"
                  unchecked-value="false"
                  v-model="validCollection[item.id]"
                  disabled
                  aria-label="..."
                />
              </div>
            </template>
            <template v-slot:cell(isPaid)="{ item }">
              <div class="form-check">
                <input
                  class="form-check-input position-static"
                  type="checkbox"
                  unchecked-value="false"
                  v-model="paidCollection[item.id]"
                  aria-label="..."
                />
              </div>
            </template>
          </b-table>
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
            :disabled="saving == 1"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="saving == 1"
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
      sortBy: "name",
      paidCollection: {},
      validCollection: {},
      fields: [
        {
          key: "name",
          label: "Team",
          sortable: true
        },
        {
          key: "gM.name",
          label: "Team GM",
          sortable: true
        },
        {
          key: "gM.email",
          label: "Email",
          sortable: true
        },
        {
          key: "isValid",
          label: "Valid",
          sortable: true
        },
        {
          key: "isPaid",
          label: "Paid",
          sortable: true
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
      result() {
        var i;
        if (this.leagues == null || this.leagues[0] == null) {
          return;
        }
        if (!this.$store.getters["auth/userIsLeagueOwner"](this.id)) {
          this.$router.push({ name: "unauthorized" });
        }
        for (i = 0; i < this.leagues[0].fantasyTeams.length; i++) {
          var ft = this.leagues[0].fantasyTeams[i];
          this.paidCollection[ft.id] = ft.isPaid;
          this.validCollection[ft.id] = ft.isValid;
        }
      }
    }
  },
  methods: {
    updateLeague(evt) {
      evt.preventDefault();
      this.saving = 1;
      this.saveSuccess = false;
      this.saveFailed = false;

      var fantasyTeams = [];
      for (let [id, value] of Object.entries(this.paidCollection)) {
        fantasyTeams.push({ id: id, isPaid: value });
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
