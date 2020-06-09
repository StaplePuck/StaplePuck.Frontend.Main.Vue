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
          <label label-for="userEmail">Email Adress:</label>
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
      emailOptions: { true: "Yes", false: "No" }
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
          this.$bvToast.toast("User information saved", {
            title: "Success",
            autoHideDelay: 5000,
            variant: "success",
            toaster: "b-toaster-top-center",
            appendToast: true
          });
        })
        .catch((error) => {
          DisplayErrors(this.$bvToast, error);
        });
    }
  }
};
</script>
