<template>
  <div class="container">
    <p>
      Welcome to StaplePuck. In order to continue you will need to define a
      handle that you want to go by and your email address to receive updates.
      Note that the handle is not the same as your team name.
    </p>
    <h4 v-if="loading">Loading...</h4>
    <b-form v-else @submit="updateUser">
      <div class="text-left">
        <b-form-group
          label-cols-sm="3"
          label="Handle:"
          label-align-sm="right"
          label-for="userName"
        >
          <b-input
            id="userName"
            v-model="currentUser.name"
            required
            trim
          ></b-input>
        </b-form-group>
        <b-form-group
          label-cols-sm="3"
          label="Email Address:"
          label-align-sm="right"
          label-for="userEmail"
        >
          <b-input
            id="userEmail"
            v-model="currentUser.email"
            required
            trim
          ></b-input>
        </b-form-group>
        <b-form-group
          label-cols-sm="3"
          label="Receive Emails:"
          label-align-sm="right"
          class="mb-0"
          label-for="userReceiveEmails"
        >
          <b-form-radio-group
            class="pt-2"
            id="userReceiveEmails"
            name="receiveEmails"
            v-model="currentUser.receiveEmails"
          >
            <b-form-radio value="true">Yes</b-form-radio>
            <b-form-radio value="false">No</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
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
        <div class="text-center">
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
        </div>
      </div>
    </b-form>
  </div>
</template>

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
              receiveEmails: this.currentUser.receiveEmails
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
