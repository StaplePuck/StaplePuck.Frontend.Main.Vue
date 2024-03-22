<template>
  <div class="container">
    <div class="summary text-center">
      <h1>{{ headline }}</h1>
      <slot>
        This will only be displayed if there is no content to be distributed.
      </slot>
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
  h1 {
    font-size: 2em;
    font-weight: 700;
  }
}
</style>
