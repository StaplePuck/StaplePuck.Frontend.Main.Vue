<template>
  <div class="container">
    <h4 v-if="loading">Loading...</h4>
    <div v-else v-for="(league, idx) in leagues" :key="idx">
      <div class="container">
        <b-form @submit="updateLeague">
          <b-form-group
            label-cols-sm="3"
            label="Name:"
            label-align-sm="right"
            label-for="leagueName"
          >
            <b-input
              id="leagueName"
              v-model="league.name"
              required
              trim
            ></b-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="3"
            label="Description:"
            label-align-sm="right"
            label-for="description"
          >
            <b-input
              id="description"
              v-model="league.description"
              trim
            ></b-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="3"
            label="Announcement:"
            label-align-sm="right"
            label-for="announcement"
          >
            <b-input
              id="announcement"
              v-model="league.announcement"
              trim
            ></b-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="3"
            label="Payment Info:"
            label-align-sm="right"
            label-for="paymentInfo"
          >
            <b-input
              id="paymentInfo"
              v-model="league.paymentInfo"
              trim
            ></b-input>
          </b-form-group>
          <b-form-checkbox
            id="allowMultipleTeams"
            v-model="league.allowMultipleTeams"
            name="allowMultipleTeams"
            value="true"
            unchecked-value="false"
          >
            Allow Multiple Teams
          </b-form-checkbox>
          <b-form-checkbox
            id="locked"
            v-model="league.isLocked"
            name="locked"
            value="true"
            unchecked-value="false"
          >
            Locked
          </b-form-checkbox>
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
              <b-form-checkbox
                v-model="validCollection[item.id]"
                name="valid"
                value="true"
                unchecked-value="false"
                disabled
              >
              </b-form-checkbox>
            </template>
            <template v-slot:cell(isPaid)="{ item }">
              <b-form-checkbox
                v-model="paidCollection[item.id]"
                name="paid"
                value="true"
                unchecked-value="false"
              >
              </b-form-checkbox>
            </template>
          </b-table>
          <div class="text-center">
            <b-button type="submit">Save</b-button>
          </div>
        </b-form>
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
      loading: 0
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
              description: this.leagues[0].description,
              announcement: this.leagues[0].announcement,
              paymentInfo: this.leagues[0].paymentInfo,
              allowMultipleTeams: this.leagues[0].allowMultipleTeams,
              isLocked: this.leagues[0].isLocked,
              fantasyTeams: fantasyTeams
            }
          }
        })
        .catch((error) => {
          DisplayErrors(this.$bvToast, error);
        });
    }
  }
};
</script>
