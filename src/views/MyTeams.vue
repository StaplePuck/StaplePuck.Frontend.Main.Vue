<template>
  <div class="container">
    <PageSummary headline="My Teams">
      <p>
        Teams you created, the good and the ugly.
      </p>
    </PageSummary>
    <MyTeams />
  </div>
</template>

<script>
import MyTeams from "@/components/MyTeams.vue";
import PageSummary from "../components/PageSummary.vue";

export default {
  name: "myTeams",
  components: {
    MyTeams,
    PageSummary
  }
};
</script>
