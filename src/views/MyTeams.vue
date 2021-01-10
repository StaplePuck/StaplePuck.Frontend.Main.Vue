<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md text-center">
        <h1>My Teams</h1>
      </div>
      <MyTeams />
    </div>
  </div>
</template>

<script>
import MyTeams from "@/components/MyTeams.vue";

export default {
  name: "myTeams",
  components: {
    MyTeams
  }
};
</script>
