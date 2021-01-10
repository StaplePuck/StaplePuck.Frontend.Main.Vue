<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md text-center">
        <h1>StaplePuck Profile</h1>
      </div>
      <UserProfile />
    </div>
  </div>
</template>

<script>
import UserProfile from "@/components/UserProfile.vue";

export default {
  name: "user",
  components: {
    UserProfile
  }
};
</script>
