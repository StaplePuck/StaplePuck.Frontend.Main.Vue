<template>
  <div id="app">
    <div class="main-content">
      <div class="nav-logo">
        <PageMainNav />
        <img
          alt="StaplePuck logo"
          src="./assets/StaplePuckLogo.png"
          width="200"
          height="200"
        />
      </div>
      <main>
        <router-view />
      </main>
    </div>
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
.main-content {
  margin-bottom: 1rem;
}
h2 {
  text-align: center;
  font-size: 1.75em !important;
  font-weight: 700 !important;
}
main,
footer {
  a {
    color: #000099 !important ;
    font-weight: 700 !important ;
  }
}
.a-button {
  margin: 0.5em 0;
  color: #fff;
  text-decoration: none;
}
.form-width {
  max-width: 720px;
  margin-right: auto;
  margin-left: auto;
}
.card {
  border-radius: 0 !important;
  .card-header {
    padding: 0.5rem 1rem;
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
    margin-bottom: 0;
    padding-left: 1rem;
    li {
      span {
        font-weight: bold;
      }
    }
  }
}
.card-links {
  color: #000099;
  font-weight: 700;
}
.alert-msg {
  color: #e31c3d;
}
</style>
<style scoped lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
.nav-logo {
  text-align: center;
}
.pipes {
  margin: 0.25em;
}
</style>
