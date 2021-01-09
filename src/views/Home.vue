<template>
  <div class="container">
    <PageSummary headline="A new twist on fantasy sports" />
    <AllLeagues />
  </div>
</template>

<script>
import PageSummary from "@/components/PageSummary.vue";
import AllLeagues from "@/components/AllLeagues.vue";

export default {
  name: "home",
  components: {
    PageSummary,
    AllLeagues
  }
};
</script>
