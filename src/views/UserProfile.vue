<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <PageSummary headline="User Profile">
        <p>
          Feel free to update your email preferences.
        </p>
      </PageSummary>
      <UserProfile />
    </div>
  </div>
</template>

<script>
import UserProfile from "../components/UserProfile.vue";
import PageSummary from "../components/PageSummary.vue";

export default {
  name: "user",
  components: {
    UserProfile,
    PageSummary
  }
};
</script>
