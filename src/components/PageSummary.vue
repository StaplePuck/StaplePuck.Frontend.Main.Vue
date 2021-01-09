<template>
  <div class="container">
    <div class="summary">
      <h1>{{ headline }}</h1>
      Enable
      <router-link :to="{ name: 'pushInfo' }">push notifications</router-link>
      to enhance your experience.
    </div>
  </div>
</template>
<script>
export default {
  name: "PageSummary",
  props: {
    headline: String
  }
};
</script>
<style scoped lang="scss">
.summary {
  text-align: center;
  margin: 0.5rem;
  h1 {
    font-size: 2em;
    font-weight: 700;
  }
}
</style>
