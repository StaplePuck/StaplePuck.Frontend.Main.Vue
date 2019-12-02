<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <league-item
      v-for="league in leagues"
      :key="league.id"
      :league="league">
    </league-item>
  </div>
</template>

<script>
import LeagueItem from "./LeagueItem"
import { QUERY_ALL_LEAGUES } from "../constants/graphQLqueries/graphQLqueries"

export default {
  name: "AllLeagues",
  props: {
    msg: String
  },
  data () {
    return {
      leagues: []
    }
  },
  components: {
    LeagueItem
  },
  apollo: {
    leagues: {
      query: QUERY_ALL_LEAGUES
    }
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
