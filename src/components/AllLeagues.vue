<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else>
      <h1>{{ msg }}</h1>
      <div
        class="group-div"
        v-for="(season, ids) in seasons.slice().reverse()"
        track-by="id"
        :key="ids"
      >
        <h4 class="badge badge-warning text-center">{{ season.fullName }}</h4>
        <div class="card-deck">
          <div
            class="card text-left"
            v-for="(league, idx) in season.leagues"
            :key="idx"
          >
            <div class="card-header">
              <router-link :to="{ name: 'league', params: { id: league.id } }"
                >{{ league.name }}
              </router-link>
            </div>
            <div class="card-body">
              <ul>
                <li>
                  {{ league.season.sport.name }}
                </li>
                <li>
                  {{ league.description }}
                </li>
                <li v-if="league.announcement != ''">
                  <span style="color: darkred;">
                    <b>{{ league.announcement }}</b>
                  </span>
                </li>
              </ul>
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
h4 {
  margin-top: 0.5rem;
}
.card-body {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
p {
  margin-top: 0;
  margin-bottom: 0;
}
.badge {
  font-size: large;
  display: block;
}
.group-div {
  padding-top: 1em;
}
</style>
