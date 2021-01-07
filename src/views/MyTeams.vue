<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md text-center">
        <h2>My Teams</h2>
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
