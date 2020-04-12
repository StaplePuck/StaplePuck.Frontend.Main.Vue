<template>
  <div class="container rules">
    <h5>League Rules</h5>
    <h4 v-if="loading">Loading Rules...</h4>
    <div v-else v-for="(league, idx) in leagues" :key="idx">
      <b-card-group>
        <b-card
          deck
          no-body
          v-for="(position, idx) in league.numberPerPositions"
          :key="idx"
        >
          <b-card-header>
            {{ position.positionType.name }}
          </b-card-header>
          <b-list-group-item>Players Per Position: {{ position.count }} </b-list-group-item>
          <b-list-group flush>
            <b-list-group-item
              v-for="(rule, idr) in getScoringRules(
                league.scoringRules,
                position.positionType.id
              )"
              :key="idr"
            >
              {{ rule.scoringType.name }}: {{ rule.pointsPerScore }} points
            </b-list-group-item>
          </b-list-group>
        </b-card>
        <b-card deck no-body>
          <b-card-header>Other</b-card-header>
          <b-list-group flush>
            <b-list-group-item
              v-for="(rule, idr) in getScoringRules(league.scoringRules, 1)"
              :key="idr"
            >
              {{ rule.scoringType.name }}: {{ rule.pointsPerScore }} points
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import { GET_LEAGUE_RULES } from "../constants/graphQLqueries/graphQLqueries";

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
    leagues: {
      query: GET_LEAGUE_RULES,
      variables() {
        return {
          leagueId: this.leagueId
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
          scoringRules[i].pointsPerScore > 0
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
.rules {
  margin-bottom: 1em;
}

.list-group-item {
  border: 0;
}
</style>