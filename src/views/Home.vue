<template>
  <div>
    <div class="summary">
        We offer
        <router-link :to="{ name: 'pushInfo' }">push notifications</router-link>
        to enhance your StaplePuck experience
    </div>
    <AllLeagues msg="StaplePuck Leagues" />
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
