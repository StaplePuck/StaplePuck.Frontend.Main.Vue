<template>
  <div class="container">
    <h4 v-if="loading">Loading...</h4>
    <div v-else>
      <h2>{{ msg }}</h2>
      <b-card-group>
        <b-card no-body deck v-for="(league, idx) in leagues" :key="idx">
          <b-card-header>
            <router-link
              :to="{ name: 'league', params: { id: league.id } }"
              class="card-link"
              >{{ league.name }}</router-link
            >
          </b-card-header>
          <b-list-group flush>
            <b-list-group-item>{{
              league.season.sport.name
            }}</b-list-group-item>
            <b-list-group-item>{{ league.season.fullName }}</b-list-group-item>
            <b-list-group-item>{{ league.description }}</b-list-group-item>
          </b-list-group>
          <p style="color:red;">
            {{ league.announcement }}
          </p>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import { QUERY_ALL_LEAGUES } from "../constants/graphQLqueries/graphQLqueries";

export default {
  name: "AllLeagues",
  props: {
    msg: String
  },
  data() {
    return {
      leagues: [],
      loading: 0
    };
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
