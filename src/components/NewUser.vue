<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <form v-else @submit="updateUser">
      <div class="form-group">
        <label label-for="userName">Username:</label>
        <input
          type="text"
          id="userName"
          class="form-control"
          required
          trim
          v-model="currentUser.name"
        />
      </div>
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
        <p>User data not saved:</p>
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
</template>

<style scoped lang="scss">
label {
  margin-bottom: 0;
  font-weight: bold;
}
</style>

<script>
import { UPDATE_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries";
import { DisplayErrors } from "../serverInputErrors";

export default {
  name: "NewUser",
  data() {
    return {
      currentUser: { name: "", email: "", receiveEmails: true },
      newUser: false,
      loading: 0,
      emailOptions: { true: "Yes", false: "No" },
      saving: 0,
      saveSuccess: false,
      saveFailed: false,
      saveErrors: {}
    };
  },
  methods: {
    updateUser(evt) {
      evt.preventDefault();
      this.saving = 1;
      this.$apollo
        .mutate({
          mutation: UPDATE_USER_PROFILE,
          variables: {
            user: {
              name: this.currentUser.name,
              email: this.currentUser.email,
              receiveEmails: (this.currentUser.receiveEmails == 'true' || this.currentUser.receiveEmails === true)
            }
          }
        })
        .then(() => {
          this.saveFailed = false;
          this.saveSuccess = true;
          this.saving = 0;
          this.$router.push("/");
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
