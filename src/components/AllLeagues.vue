<template>
  <div class="container">
    <h2>{{ msg }}</h2>
      <b-card-group>
        <b-card no-body deck v-for="(league, idx) in leagues" :key="idx">
          <b-card-header>
            <a href="#" class="card-link">{{ league.name }}</a>
          </b-card-header>
          <b-list-group flush>
            <b-list-group-item>{{ league.season.sport.name }}</b-list-group-item>
            <b-list-group-item>{{ league.season.fullName }}</b-list-group-item>
            <b-list-group-item>{{ league.description }}</b-list-group-item>
          </b-list-group>
          <p style="color:red;">
            {{ league.announcement }}
          </p>
        </b-card>
      </b-card-group>
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
a {
  color: darkblue;
  font-weight: 700;
  text-decoration: underline;
  &::after {
    content: " >";
  }
}
</style>
