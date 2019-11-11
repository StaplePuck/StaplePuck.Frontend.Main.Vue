<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      The grid of leagues will go here
    </p>
  </div>
</template>

<script>
export default {
  name: "AllLeagues",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
