<template>
  <div id="app">
    <PageMainNav />
    <main>
      <router-view />
    </main>
    <PageFooter />
  </div>
</template>
<script>
import PageMainNav from "@/components/PageMainNav.vue";
import PageFooter from "@/components/PageFooter.vue";

export default {
  components: {
    PageFooter,
    PageMainNav
  }
};
</script>
<style lang="scss">
.modal-content {
  font-family: Arial, sans-serif;
  font-size: 12px;
}
.modal-header {
  background-color: #fff !important;;
}
.row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}
main {
  margin: 1rem 0;
}
main,
footer {
  a {
    color: #000099;
  }
}
h2 {
  text-align: center;
  font-size: 1.75em !important;
  font-weight: 700 !important;
}
.a-button {
  margin: 0.5em 0;
  color: #fff;
}
.form-width {
  max-width: 720px;
  margin-right: auto;
  margin-left: auto;
}
.card {
  border-radius: 0 !important;
  .card-header:first-child {
    border-radius: 0;
  }
  .card-header {
    color: #fff;
    padding: 0.5rem 1rem;
    background-color: #5b616b;
    a {
      color: #fff;
      font-weight: 700;
      text-decoration: underline;
    }
    h1 {
      text-align: center;
      font-size: 1.5rem;
      margin: 0;
    }
  }
  .card-body {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }
  ul {
    list-style: square;
    margin-bottom: 0;
    padding-left: 1rem;
  }
}
.alert-msg {
  color: #e31c3d;
  font-weight: normal;
}
</style>
<style scoped lang="scss">
#app {
  font-family: Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #30303c;
  position: relative;
  min-height: 100vh;
}
#nav {
  padding-top: 15px;
  padding-bottom: 0;
  a {
    font-weight: bold;
    color: #30303c;
    cursor: pointer;
    text-decoration: underline;
    &.router-link-exact-active {
      background-color: #ffc107;
      text-decoration: none;
      padding-right: 0.6em;
      padding-left: 0.6em;
      border-radius: 10rem;
    }
  }
}
.pipes {
  margin: 0.25em;
}
</style>
