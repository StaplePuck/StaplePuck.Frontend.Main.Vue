<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md text-center">
        <h2>StaplePuck Profile</h2>
        <UserProfile/>
      </div>
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

<style scoped lang="scss">

</style>