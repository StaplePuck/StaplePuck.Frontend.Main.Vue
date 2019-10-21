<template>
  <div class="home">
    <img alt="StaplePuck logo" src="../assets/StaplePuck-Logo.png" width="200" height="200"/>
    <AllLeagues msg="Current StaplePuck Leagues" />
  </div>
</template>

<script>
// @ is an alias to /src
import AllLeagues from "@/components/AllLeagues.vue";

export default {
  name: "home",
  components: {
    AllLeagues
  }
};
</script>

<style scoped lang="scss">
img {
  padding:0;
  margin:0;
}
</style>
