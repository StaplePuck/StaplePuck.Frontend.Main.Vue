<template>
  <footer>
    <div class="container text-center">
      <a
        class="btn btn-primary btn-floating m-1"
        style="background-color: #3b5998;"
        href="https://www.facebook.com/groups/staplepuck/"
        ><font-awesome-icon :icon="{ prefix: 'fab', iconName: 'facebook' }"
      /></a>
      <a
        class="btn btn-primary btn-floating m-1"
        style="background-color: #ac2bac;"
        href="https://www.instagram.com/staplepuck/"
        ><font-awesome-icon :icon="{ prefix: 'fab', iconName: 'instagram' }"
      /></a>
    </div>
    <div class="container text-center">
      <a
        target="_blank"
        rel="noreferrer"
        href="https://www.termsfeed.com/privacy-policy/1d035b59d3dcbf692dbce4eead4ec7d8"
      >
        Privacy Policy
      </a>
    </div>
  </footer>
</template>
<script>
export default {
  name: "PageFooter"
};
</script>
<style scoped lang="scss">
footer {
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  background-color: #e4e2e0;
}
</style>
