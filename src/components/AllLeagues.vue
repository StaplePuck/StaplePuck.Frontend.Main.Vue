<template>
  <div>
    <div v-if="loading" class="text-center h3"> 
      Loading... <font-awesome-icon :icon="[ 'fas', 'snowflake']" spin/>
    </div>
    <div v-else>
      <h2>Latest Leagues</h2>
      <div
        class="group-div"
        v-for="(season, ids) in seasons.slice().reverse()"
        track-by="id"
        :key="ids"
      >
        <span class="badge badge-warning text-center">{{
            season.fullName
          }}</span>
        <div class="card-deck">
          <div class="card border-top-0" v-for="(league, idx) in season.leagues" :key="idx">
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
                  <b>Sport:</b> {{ league.season.sport.name }}
                </li>
                <li>
                  <b>About:</b> {{ league.description }}
                </li>
                <li v-if="league.announcement != ''">
                  <span class="alert-msg" v-html="league.announcement">
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
h2 {
  margin-bottom: 0;
}
.badge {
  font-size: 1rem;
  display: block;
  border-radius: 0;
}
.badge-warning {
  background-color: #000;
  color: #ffc107;
}
.group-div {
  padding-top: 1em;
}
.border-top-0 {
  border-top: none;
}
</style>
