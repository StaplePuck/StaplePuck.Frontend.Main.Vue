<template>
  <div>
    <h2 class="text-center">League Rules</h2>
    <div v-if="loading" class="text-center h3"> 
      Loading... <font-awesome-icon :icon="[ 'fas', 'snowflake']" spin/>
    </div>
    <div v-else>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4">
        <div
          class="col mb-4"
          v-for="(position, idx) in league.numberPerPositions"
          :key="idx"
        >
          <div class="card">
            <div class="card-header">
              {{ position.positionType.name }}: {{ position.count }} players per team
            </div>
            <div class="card-body">
              <p
                v-for="(rule, idr) in getScoringRules(
                  league.scoringRules,
                  position.positionType.id
                )"
                :key="idr"
              >
                <b>{{ rule.scoringType.name }}</b
                >:
                {{ rule.scoringWeight.toFixed(2).replace(/[.]00$/, "") }} points
              </p>
            </div>
          </div>
        </div>
        <div class="col mb-4">
          <div class="card">
            <div class="card-header">
              Other
            </div>
            <div class="card-body">
              <p
                v-for="(rule, idr) in getScoringRules(league.scoringRules, 1)"
                :key="idr"
              >
                <b>{{ rule.scoringType.name }}</b
                >:
                {{ rule.scoringWeight.toFixed(2).replace(/[.]00$/, "") }} points
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { GET_LEAGUE_RULES } from "../constants/graphQLqueries/staplePuck2Queries";

export default {
  name: "LeagueRules",
  data() {
    return {
      errorListKey: 0,
      loading: 0
    };
  },
  props: ["leagueId"],
  apollo: {
    league: {
      client: 'staplePuck2Client',
      query: GET_LEAGUE_RULES,
      fetchPolicy: 'cache-first',
      variables() {
        return {
          leagueId: Number(this.leagueId)
        };
      }
    }
  },
  methods: {
    getScoringRules(scoringRules, positionId) {
      var i;
      const rules = [];
      for (i = 0; i < scoringRules.length; i++) {
        if (
          scoringRules[i].positionType.id == positionId &&
          scoringRules[i].scoringWeight > 0
        ) {
          rules.push(scoringRules[i]);
        }
      }
      return rules.sort((a, b) =>
        a.scoringType.name.localeCompare(b.scoringType.name)
      );
    }
  }
};
</script>
<style scoped lang="scss">
.list-group-item {
  border: 0;
}
p {
  margin-top: 0;
  margin-bottom: 0;
}
.mb-4 {
  margin-bottom: 0.5rem !important;
}
</style>
