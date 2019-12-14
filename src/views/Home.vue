<template>
  <div class="home">
    <AllLeagues msg="Current StaplePuck Leagues" />
  </div>
</template>

<script>
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
  padding: 0;
  margin: 0;
}
</style>
