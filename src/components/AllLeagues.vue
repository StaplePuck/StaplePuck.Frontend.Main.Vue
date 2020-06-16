<template>
  <div class="container">
    <h4 v-if="loading">Loading...</h4>
    <div v-else>
      <h1>{{ msg }}</h1>
      <div
        v-for="(season, ids) in seasons.slice().reverse()"
        track-by="id"
        :key="ids"
      >
        <h1>{{ season.fullName }}</h1>
        <div class="card-deck">
          <div class="card" v-for="(league, idx) in season.leagues" :key="idx">
            <div class="card-header">
              <router-link :to="{ name: 'league', params: { id: league.id } }"
                >{{ league.name }}
              </router-link>
            </div>
            <div class="card-body">
              <p>{{ league.season.sport.name }}</p>
              <p>{{ league.description }}</p>
              <p style="color: red;">{{ league.announcement }}</p>
            </div>
          </div>
        </div>
      </div>
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
      seasons: [],
      loading: 0
    };
  },
  apollo: {
    seasons: {
      query: QUERY_ALL_LEAGUES
    }
  }
};
</script>

<style scoped lang="scss">
a {
  color: darkblue;
  font-weight: 700;
  text-decoration: underline;
  &::after {
    content: " >";
  }
}
</style>
