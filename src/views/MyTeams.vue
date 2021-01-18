<template>
  <div class="container">
    <div class="col-md text-center">
      <h1>My Teams</h1>
    </div>
    <MyTeams />
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
