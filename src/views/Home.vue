<template>
  <div>
    <AllLeagues msg="StaplePuck Leagues" />
    <div class="container">
      <div id="nav">
        <router-link :to="{ name: 'pushInfo' }">Push Notifications</router-link>
      </div>
    </div>
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
