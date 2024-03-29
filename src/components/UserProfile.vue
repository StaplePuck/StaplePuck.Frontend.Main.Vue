<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else>
      <form @submit="updateUser" class="form-width">
        <p><b>Username:</b> {{ currentUser.name }}</p>
        <div class="form-group">
          <label for="userEmail">Email Address:</label>
          <input
            type="text"
            id="userEmail"
            class="form-control"
            required
            trim
            v-model="currentUser.email"
          />
        </div>
        <fieldset role="radiogroup" tabindex="-1">
          <legend>Receive Emails:</legend>
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
            <label class="form-check-label" :for="'userReceiveEmails_' + key">
              {{ emailOption }}
            </label>
          </div>
        </fieldset>
        <div v-if="this.canDoPushNotifications">
          <fieldset role="radiogroup" tabindex="-1">
            <legend>Receive Notifications:</legend>
            <div
              class="form-check form-check-inline"
              v-for="(emailOption, key) in emailOptions"
              :key="key"
            >
              <input
                type="radio"
                class="form-check-input"
                name="receiveNotifications"
                :id="'userReceiveNotifications_' + key"
                :value="key"
                v-model="currentUser.receiveNotifications"
              />
              <label
                class="form-check-label"
                :for="'userReceiveNotifications_' + key"
              >
                {{ emailOption }}
              </label>
            </div>
          </fieldset>
          <fieldset role="radiogroup" tabindex="-1">
            <legend>Receive Notifications for Dropping Rank:</legend>
            <div
              class="form-check form-check-inline"
              v-for="(emailOption, key) in emailOptions"
              :key="key"
            >
              <input
                type="radio"
                class="form-check-input"
                name="receiveNegativeNotifications"
                :id="'userReceiveNegativeNotifications_' + key"
                :value="key"
                v-model="currentUser.receiveNegativeNotifications"
              />
              <label
                class="form-check-label"
                :for="'userReceiveNegativeNotifications_' + key"
              >
                {{ emailOption }}
              </label>
            </div>
          </fieldset>
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
</template>

<style scoped lang="scss">
label {
  margin-bottom: 0;
  font-weight: bold;
}
legend {
  margin-bottom: 0;
  font-weight: bold;
  font-size: 16px;
}
</style>

<script>
import { QUERY_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries";
import { UPDATE_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries";
import { DisplayErrors } from "../serverInputErrors";

export default {
  name: "UserProfile",
  data() {
    return {
      currentUser: {
        name: "",
        email: "",
        receiveEmails: true,
        receiveNotifications: true,
        receiveNegativeNotifications: true
      },
      newUser: false,
      loading: 0,
      emailOptions: { true: "Yes", false: "No" },
      saving: 0,
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
  computed: {
    canDoPushNotifications: function () {
      if (this.currentUser.notificationTokens.length > 0) {
        return true;
      }
      return true;
    }
  },
  methods: {
    updateUser(evt) {
      evt.preventDefault();
      this.saving = 1;
      this.saveSuccess = false;
      this.saveFailed = false;
      this.$apollo
        .mutate({
          mutation: UPDATE_USER_PROFILE,
          variables: {
            user: {
              email: this.currentUser.email,
              receiveEmails: (this.currentUser.receiveEmails == 'true' || this.currentUser.receiveEmails === true),
              receiveNotifications: (this.currentUser.receiveNotifications == 'true' || this.currentUser.receiveNotifications === true),
              receiveNegativeNotifications: (this.currentUser
                .receiveNegativeNotifications == 'true' || this.currentUser
                .receiveNegativeNotifications === true)
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
