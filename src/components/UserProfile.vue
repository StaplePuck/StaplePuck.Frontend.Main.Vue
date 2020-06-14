<template>
  <div class="container">
    <h4 v-if="loading">Loading...</h4>
    <div v-else>
      <div class="text-center">
        <p><b>Handle:</b> {{ currentUser.name }}</p>
        <p>Feel free to update your email preferences</p>
      </div>
      <form @submit="updateUser" class="form-width">
        <div class="form-group">
          <label label-for="userEmail">Email Address:</label>
          <input
            type="text"
            id="userEmail"
            class="form-control"
            required
            trim
            v-model="currentUser.email"
          />
        </div>
        <label>Receive Emails:</label>
        <div role="radiogroup" tabindex="-1">
          <div
            class="form-check form-check-inline"
            v-for="(emailOption, key) in emailOptions"
            :key="key"
          >
            <input
              type="radio"
              class="form-check-input"
              name="receiveEmails"
              :id="'userReceiveEmails_' + key"
              :value="key"
              v-model="currentUser.receiveEmails"
            />
            <label class="form-check-label" for="'userReceiveEmails_' + key">
              {{ emailOption }}
            </label>
          </div>
        </div>
        <div v-show="saveSuccess" class="alert alert-success">
          Save Successful
        </div>
        <div v-show="saveFailed" class="alert alert-danger">
          <p>Save Complete but Not Valid:</p>
          <p
            v-for="(thisError, index) in saveErrors"
            :key="`saveErrors-${index}`"
          >
            {{ thisError }}
          </p>
        </div>
        <input class="btn btn-secondary a-button" type="submit" value="Save" />
      </form>
    </div>
  </div>
</template>

<script>
import { QUERY_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries";
import { UPDATE_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries";
import { DisplayErrors } from "../serverInputErrors";

export default {
  name: "UserProfile",
  data() {
    return {
      currentUser: { name: "", email: "", receiveEmails: true },
      newUser: false,
      loading: 0,
      emailOptions: { true: "Yes", false: "No" },
      saveSuccess: false,
      saveFailed: false,
      saveErrors: {}
    };
  },
  apollo: {
    currentUser: {
      query: QUERY_USER_PROFILE
    }
  },
  methods: {
    updateUser(evt) {
      evt.preventDefault();
      this.saveSuccess = false;
      this.saveFailed = false;
      this.$apollo
        .mutate({
          mutation: UPDATE_USER_PROFILE,
          variables: {
            user: {
              email: this.currentUser.email,
              receiveEmails: this.currentUser.receiveEmails
            }
          }
        })
        .then(() => {
          this.saveFailed = false;
          this.saveSuccess = true;
        })
        .catch((error) => {
          this.saveSuccess = false;
          this.saveFailed = true;
          this.saveErrors = DisplayErrors(this.$bvToast, error);
        });
    }
  }
};
</script>
