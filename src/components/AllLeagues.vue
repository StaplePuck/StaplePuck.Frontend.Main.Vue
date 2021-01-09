<template>
  <div class="container">
    <h4 v-if="loading" class="text-center">Loading...</h4>
    <div v-else>
      <h1>{{ msg }}</h1>
      <div class="summary">
        We offer
        <router-link :to="{ name: 'pushInfo' }">push notifications</router-link>
        to enhance your StaplePuck experience
      </div>
      <div
        class="group-div"
        v-for="(season, ids) in seasons.slice().reverse()"
        track-by="id"
        :key="ids"
      >
        <h4 class="badge badge-warning text-center">{{ season.fullName }}</h4>
        <div class="card-deck">
          <div
            class="card card-styles text-left"
            v-for="(league, idx) in season.leagues"
            :key="idx"
          >
            <div class="card-header">
              <router-link
                class="card-links"
                :to="{ name: 'league', params: { id: league.id } }"
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
                  <span class="alert-msg">
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
.summary {
  text-align: center;
  a {
    color: darkblue;
    text-decoration: underline;
  }
}
h4 {
  margin-top: 0.5rem;
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
