<template>
  <div class="container">
    <div v-if="currentUser.name">
      <b>Username:</b> {{ currentUser.name }}
      <br />
      Feel free to update your email preferences
      <div class="text-left">
        <b-form @submit="updateUser">
          <b-form-group
            label-cols-sm="3"
            label="Email Address:"
            label-align-sm="right"
            label-for="userEmail"
          >
            <b-input id="userEmail" v-model="currentUser.email"></b-input>
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
          <div class="text-center">
            <b-button type="submit">Save</b-button>
          </div>
        </b-form>
      </div>
      
    </div>
  </div>
</template>

<script>
import { QUERY_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries";
import { UPDATE_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries";

export default {
  name: "UserProfile",
  data() {
    return {
      currentUser: []
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
      this.$apollo.mutate({
        mutation: UPDATE_USER_PROFILE,
        variables: {
          user: {  
            email: userEmail.value,
            receiveEmails: this.receiveEmails
          }
        }
      })
    }
  }
};
</script>