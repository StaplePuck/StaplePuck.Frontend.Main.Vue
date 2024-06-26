<template>
    <b-modal id="player-select-modal" v-bind:title="player?.fullName">
        <img v-bind:src="'https://assets.staplepuck.com/headshots/' + player.id + '.png'" width="70" />
        <img v-bind:src="'https://assets.staplepuck.com/logos/' + player.team?.id + '.svg'" width="70" /> <br />
        <b>Team:</b> {{ player.team?.fullName }} <br />
        <b>Number:</b> {{ player.number }} <br />
        <b>Position:</b> {{ player.positionType?.name }} <br />
        <b>Profile Links: </b>
        <a v-if="player.externalId" v-bind:href="league.season.externalPlayerUrl + player.externalId" target="_blank">NHL</a>, 
        <a v-if="player.externalId2" v-bind:href="league.season.externalPlayerUrl2 + player.externalId2" target="_blank">ESPN</a><br />

        <table class="table table-sm table-bordered">
            <thead>
                <tr>
                    <th rowspan="2"></th>
                    <th v-for="span in spans" colspan="3" style="text-align:center">{{ span.name }}</th>
                </tr>
                <tr>
                    <template v-for="span in spans">
                        <th>Score</th>
                        <th>Rank</th>
                        <th>Pos.<br> Rank</th>
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
                <b-button v-if="includeAdd" 
                    variant="primary" 
                    size="sm" 
                    class="float-right" 
                    @click="addPlayer()"
                    :disabled="saving == 1">
                    <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                        v-if="saving == 1"
                    ></span>
                    Add
                </b-button>
                <b-button v-if="includeRemove" 
                    variant="primary" 
                    size="sm" 
                    class="float-right" 
                    @click="removePlayer()"
                    :disabled="saving == 1">
                    <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                        v-if="saving == 1"
                    ></span>
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
    props: ["fantasyTeamId", "player", "league", "lastSpot", "includeAdd", "includeRemove"],
    computed: { 
        fantasyTeam() {
            return this.$store.state.teamEdit.fantasyTeam;
        },
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
        addPlayer() {
            this.saving = 1;
            const list = [];
            const playerIds = this.fantasyTeam.playerIds;
            for (let i = 0; i < playerIds.length; i++) {
                const fp = playerIds[i];
                list.push({ playerId: Number(fp) });
            }

            list.push({ playerId: Number(this.player.id) });
            this.saveTeam(list);
            this.$store.commit('teamEdit/addPlayer', this.player.id);
        },
        removePlayer() {
            this.saving = 1;
            const list = [];
            const playerId = Number(this.player.id);
            const playerIds = this.fantasyTeam.playerIds;
            for (let i = 0; i < playerIds.length; i++) {
                const fp = playerIds[i];
                if (playerId !== fp) {
                    list.push({ playerId: Number(fp) });
                }
            }

            this.saveTeam(list);
            this.$store.commit('teamEdit/removePlayer', this.player.id);
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
                    if (this.$route.name !== 'editTeam') {
                        if (this.lastSpot) {
                            this.$router.push({ name: "editTeam", params: { id: this.fantasyTeamId } });
                        } else {
                            this.$bvModal.hide('player-select-modal');
                        }
                    } else { 
                        this.$router.go();
                    }
                })
                .catch((error) => {
                    this.saveSuccess = false;
                    this.saveFailed = true;
                    //this.saveErrors = DisplayErrors(this.$bvToast, error);
                    this.saving = 0;
                    if (this.$route.name !== 'editTeam') {
                        if (this.lastSpot) {
                            this.$router.push({ name: "editTeam", params: { id: this.fantasyTeamId } });
                        } else {
                            this.$bvModal.hide('player-select-modal');
                        }
                    } else { 
                        this.$router.go();
                    }
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
  