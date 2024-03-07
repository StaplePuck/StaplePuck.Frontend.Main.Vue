<template>
    <b-modal id="player-select-modal" v-bind:title="player?.fullName">
        <img v-bind:src="'https://assets.staplepuck.com/headshots/' + player.id + '.png'" width="70" />
        <img v-bind:src="'https://assets.staplepuck.com/logos/' + player.team?.id + '.svg'" width="70" /> <br />
        Team: {{ player.team?.fullName }} <br />
        Number: {{ player.number }} <br />
        Position: {{ player.positionType?.name }} <br />
        Profile Links: 
        <a v-if="player.externalId" v-bind:href="league.season.externalPlayerUrl + player.externalId" target="_blank">NHL</a>, 
        <a v-if="player.externalId2" v-bind:href="league.season.externalPlayerUrl2 + player.externalId2" target="_blank">ESPN</a><br />

        <table>
            <thead>
                <tr>
                    <th rowspan="2"></th>
                    <th v-for="span in spans" colspan="3" style="text-align:center">{{ span.name }}</th>
                </tr>
                <tr>
                    <template v-for="span in spans">
                        <th>Score</th>
                        <th>Rank</th>
                        <th>Position Rank</th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <tr v-for="score in scores">
                    <td>{{ score.scoringType }}</td>
                    <template v-for="s in score.scores">
                        <td>{{ s.score }}</td>
                        <td>{{ s.rank }}</td>
                        <td>{{ s.positionRank }}</td>
                    </template>
                </tr>
            </tbody>
        </table>
        <template #modal-footer>
            <div class="w-100">
                <!-- <p class="float-left">Modal Footer Content</p> -->
                <b-button v-if="includeAdd === 'true'" variant="primary" size="sm" class="float-right" @click="addPlayer()">
                    Add
                </b-button>
                <b-button v-if="includeRemove === 'true'" variant="primary" size="sm" class="float-right" @click="removePlayer()">
                    Remove
                </b-button>
            </div>
        </template>
    </b-modal>
</template>
<script>

import { SET_TEAM_LINEUP } from "../constants/graphQLqueries/graphQLqueries";
import { DisplayErrors } from "../serverInputErrors";

export default {
    name: "PlayerSelectDialog",
    data() {
        return {
            loading: 0,
            saveFailed: false,
            saveSuccess: true,
            saving: 0
        };
    },
    props: ["fantasyTeamId", "player", "league", "fantasyTeam", "includeAdd", "includeRemove"],
    computed: { 
        spans() {
            const spans = [];
            if (!this.player.hScores) {
                return spans;
            }
            for (let i = 0; i < this.player.hScores.length; i++) {
                spans.push(this.player.hScores[i].span);
            }
            return spans;
        },
        scores() {
            const types = [];
            if (!this.player.hScores) {
                return types;
            }
            for (let i = 0; i < this.player.hScores.length; i++) {
                for (let j = 0; j < this.player.hScores[i].scores.length; j++) {
                    const score = this.player.hScores[i].scores[j];
                    if (score.score > 0) {
                        const { scoringType } = score;
                        if (!types.find(x => x.id === scoringType.id)) {
                            types.push(scoringType);    
                        }
                    }
                }
            }
            types.sort((a, b) => a.id - b.id);
            
            const data = [];
            const overAll = { scoringType: 'Overall', scores: [] };
            for (let i = 0; i < this.player.hScores.length; i++) {
                const score = this.player.hScores[i];
                overAll.scores.push({
                    score: score.score,
                    rank: score.rank,
                    positionRank: score.positionRank
                });
            }
            data.push(overAll);
            for (let i = 0; i < types.length; i++) {
                const row = {
                    scoringType: types[i].name,
                    scores: []
                }
                for (let j = 0; j < this.player.hScores.length; j++) {
                    const score = this.player.hScores[j].scores.find(x => x.scoringType.id === types[i].id);
                    row.scores.push( { 
                        score: score.score,
                        rank: score.rank,
                        positionRank: score.positionRank
                 } );
                }
                data.push(row);
            }
            return data;
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
        },
        addPlayer() {
            const list = [];
            for (let i = 0; i < this.fantasyTeam.fantasyTeamPlayers.length; i++) {
                const fp = this.fantasyTeam.fantasyTeamPlayers[i];
                list.push({ playerId: Number(fp.player.id) });
            }

            list.push({ playerId: Number(this.player.id) });
            this.saveTeam(list);
        },
        removePlayer() {
            const list = [];
            const playerId = Number(this.player.id);
            for (let i = 0; i < this.fantasyTeam.fantasyTeamPlayers.length; i++) {
                const fp = this.fantasyTeam.fantasyTeamPlayers[i];
                if (playerId !== fp.player.id) {
                    list.push({ playerId: Number(fp.player.id) });
                }
            }

            this.saveTeam(list);
        },
        saveTeam(fantasyTeamPlayers) {
            this.$apollo
                .mutate({
                mutation: SET_TEAM_LINEUP,
                variables: {
                    fantasyTeam: {
                    id: Number(this.fantasyTeamId),
                    fantasyTeamPlayers
                    }
                }
                })
                .then(() => {
                this.saveFailed = false;
                this.saveSuccess = true;
                this.saving = 0;
                this.$router.push({ name: "editTeam", params: { id: this.fantasyTeamId } });
                this.$router.go();
                })
                .catch((error) => {
                this.saveSuccess = false;
                this.saveFailed = true;
                //this.saveErrors = DisplayErrors(this.$bvToast, error);
                this.saving = 0;
                this.$router.push({ name: "editTeam", params: { id: this.fantasyTeamId } });
                this.$router.go();
                });
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
  