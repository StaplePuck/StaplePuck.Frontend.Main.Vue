<template>
  <div class="container">
    <PageSummary headline="A unique twist on fantasy sports">
      <p>
        Enable
        <router-link :to="{ name: 'pushInfo' }">push notifications</router-link>
        to enhance your experience.
      </p>
    </PageSummary>
    <AllLeagues />
  </div>
</template>

<script>
import PageSummary from "../components/PageSummary.vue";
import AllLeagues from "../components/AllLeagues.vue";

export default {
  name: "home",
  components: {
    PageSummary,
    AllLeagues
  }
};
</script>
