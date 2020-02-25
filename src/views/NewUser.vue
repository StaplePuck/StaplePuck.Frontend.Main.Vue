<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md text-center">
        <h2>StaplePuck Profile</h2>
      </div>
      <NewUser/>
    </div>
  </div>
</template>

<script>
import NewUser from "@/components/NewUser.vue";

export default {
  name: "newUser",
  components: {
    NewUser
  }
};
</script>
