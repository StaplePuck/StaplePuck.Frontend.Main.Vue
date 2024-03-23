<template>
    <div class="container">
        <h1 v-if="loading" class="text-center">Loading...</h1>
        <div v-else>
            <PageSummary :headline="fantasyTeam.name">
                <p>
                    Select a player from the <b>{{ team.fullName }}</b> <br>
                    <img v-bind:src="'https://assets.staplepuck.com/logos/' + team.id + '.svg'" width="70" />
                </p>
            </PageSummary>
            <LeagueRules :leagueId="fantasyTeam.leagueId"></LeagueRules>

            <div class="col mb-2">
                <b>Stats Date Range:</b>
                <div v-for="(span, index) in spans">
                    <input type="radio" :id="span.id" :value="span.id" v-model="selectedSpan">
                    &nbsp;
                    <label>
                        {{ span.name }}
                    </label>
                </div>
            </div>
            <div class="col mb-2">
                <b>Color Key:</b>
                <div class="invalid p-1">
                    <b>Red:</b> Player not available
                </div>
            </div>

            <PlayerSelectDialog :fantasyTeamId="id" :player="selectedPlayer" :league="league" includeAdd="true" includeRemove="false" />
            <span class="px-3 mt-2 d-block font-weight-bold">Click on an available player to add them to your team</span>
            <section id="scroll-table" class="col-md">
                <table class="table table-bordered table-condensed cf">
                    <thead class="cf">
                        <tr>
                            <th v-for="(col, colID) in computedFields" :key="colID" v-on:click="sortTable(col.key)">
                                {{ col.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowID) in computedData" :key="rowID" v-bind:class="row.style" v-on:click="showPlayer(row.id)">
                            <td v-for="(col, colID) in computedFields" :key="colID">
                                <img v-bind:src="'https://assets.staplepuck.com/headshots/' + row.id + '.png'" width="30" v-if="col.key === 'fullName'" />
                                {{ row[col.key] }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </div>
</template>
  
<style scoped lang="scss">
label {
    margin-bottom: 0;
    font-weight: bold;
}
.team-info {
    margin-bottom: 1em;
}
li {
    span {
        font-weight: bold;
    }
}
.player-info {
    text-decoration: none;
    padding-right: 0.6em;
    padding-left: 0.6em;
}
table th,
table td {
    cursor: pointer;
    padding: 0.25em;
}

.sorted {
    text-decoration: underline;
}

.unsorted {
    text-decoration: none;
}

@media only screen and (max-width: 800px) {
    #scroll-table.cf:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    #scroll-table * html .cf {
        zoom: 1;
    }

    #scroll-table *:first-child+html .cf {
        zoom: 1;
    }

    #scroll-table table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
    }

    #scroll-table th,
    #scroll-table td {
        margin: 0;
        vertical-align: top;
    }

    #scroll-table th {
        text-align: left;
    }

    #scroll-table table {
        display: block;
        position: relative;
        width: 100%;
    }

    #scroll-table thead {
        display: block;
        float: left;
    }

    #scroll-table tbody {
        display: block;
        width: auto;
        position: relative;
        overflow-x: auto;
        white-space: nowrap;
    }

    #scroll-table thead tr {
        display: block;
    }

    #scroll-table th {
        display: block;
        text-align: right;
    }

    #scroll-table tbody tr {
        display: inline-block;
        vertical-align: top;
    }

    #scroll-table td {
        display: block;
        min-height: 1.25em;
        text-align: left;
    }

    /* sort out borders */
    #scroll-table th {
        border-bottom: 0;
        border-left: 0;
    }

    #scroll-table td {
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
    }

    #scroll-table tbody tr {
        border-left: 1px solid #babcbf;
    }

    #scroll-table th:last-child,
    #scroll-table td:last-child {
        border-bottom: 1px solid #babcbf;
    }
}

.invalid {
    background-color: lightpink;
    pointer-events: none;
    cursor: default;
}
.onTeam {
    background-color: lightgreen;
    pointer-events: none;
    cursor: default;
}
</style>
  
<script>
import { QUERY_LEAGUE, QUERY_PLAYERS_HISTORY_BY_LEAGUE, QUERY_SPANS } from "../constants/graphQLqueries/staplePuck2Queries";
import { SET_TEAM_LINEUP } from "../constants/graphQLqueries/graphQLqueries";
import LeagueRules from "../components/LeagueRules";
import PageSummary from "../components/PageSummary.vue";
import PlayerSelectDialog from "../components/PlayerSelectDialog.vue";

var getScoringData = function (scoring, id) {
    var i;
    for (i = 0; i < scoring.length; i++) {
        if (scoring[i].scoringType.id == id) {
            return scoring[i];
        }
    }
    return null;
};

export default {
    name: "addPlayerByTeam",
    components: {
    LeagueRules,
    PageSummary,
    PlayerSelectDialog
},
    data() {
        return {
            ascending: false,
            sortColumn: "score",
            loading: 0,
            selectedSpan: '',
            team: {},
            selectedPlayer: {},
            scoringTypes: [],
        };
    },
    computed: {
        fantasyTeam() {
            return this.$store.state.teamEdit.fantasyTeam;
        },
        computedFields() {
            const field = [];
            field.push({
                key: "fullName",
                label: "Name"
            });
            field.push({
                key: "position",
                label: "Position"
            });
            field.push({
                key: "score",
                label: "Score"
            });
            field.push({
                key: "rank",
                label: "Rank"
            });
            field.push({
                key: "positionRank",
                label: "Position Rank"
            });
            this.scoringTypes.forEach((x) => {
                field.push({
                    key: "score" + x.id,
                    label: x.shortName
                });
            });
            return field;
        },
        computedData() {
            const data = [];
            this.playersHistoryByLeague.filter(x => x.teamId === this.teamId).forEach((x) => {
                const row = {};
                row.id = x.id;
                row.fullName = x.fullName;
                row.position = x.positionType.shortName;

                const scores = x.hScores.find(x => x.spanId == this.selectedSpan);
                row.score = scores?.score;
                row.rank = scores?.rank;
                row.positionRank = scores?.positionRank;

                this.scoringTypes.forEach((s) => {
                    var text = "0";
                    var scoringData = getScoringData(
                        scores.scores,
                        s.id
                    );
                    if (scoringData != null) {
                        text = scoringData.score;
                    }
                    row["score" + s.id] = text;
                });

                row.playerIsValid = this.playerIsValid(x);
                if (row.playerIsValid === -1) {
                    row.style = 'invalid';
                } else if (row.playerIsValid === 0) {
                    row.style = 'valid';
                } else {
                    row.style = 'onTeam';
                }
                data.push(row);
            });
            const col = this.sortColumn;
            data.sort((a, b) => {
                if (a[col] > b[col]) {
                    return this.ascending ? 1 : -1;
                } else if (a[col] < b[col]) {
                    return this.ascending ? -1 : 1;
                }
                return 0;
            });
            return data;
        }
    },
    props: ['id', 'teamId'],
    apollo: {
        league: {
            client: 'staplePuck2Client',
            query: QUERY_LEAGUE,
            fetchPolicy: 'cache-first',
            variables() {
                return {
                    leagueId: this.fantasyTeam.leagueId
                };
            },
            result() {
                const list = [];
                this.league.scoringRules.forEach(x => {
                    if (x.scoringWeight > 0) {
                        if (!list.find(y => y.id === x.scoringType.id)) {
                            list.push(x.scoringType);    
                        }
                    }
                });
                list.sort((a, b) => a.id - b.id);
                this.scoringTypes = list;
            }
        },
        playersHistoryByLeague: {
            client: 'staplePuck2Client',
            query: QUERY_PLAYERS_HISTORY_BY_LEAGUE,
            fetchPolicy: 'cache-first',
            variables() {
                return {
                    leagueId: this.fantasyTeam.leagueId
                };
            },
            result() {
                if (this.playersHistoryByLeague) {
                    this.team = this.playersHistoryByLeague.find(x => x.teamId === this.teamId)?.team;

                    if (!this.team) {
                        this.$router.push({ name: "notFound" });
                    }
                    this.selectedPlayer = this.playersHistoryByLeague[0];
                }
            }
        },
        spans: {
            client: 'staplePuck2Client',
            query: QUERY_SPANS,
            fetchPolicy: 'cache-first',
            variables() {
                return {
                    leagueId: this.fantasyTeam.leagueId
                };
            },
            result() {
                if (this.spans) {
                    this.selectedSpan = this.spans[this.spans.length - 1].id;
                }
            }
        }
    },
    methods: {
        sortTable(col) {
            if (this.sortColumn === col) {
                this.ascending = !this.ascending;
            } else {
                this.ascending = true;
                this.sortColumn = col;
            }
        },
        showPlayer(playerId) {
            this.selectedPlayer = this.playersHistoryByLeague.find(x => x.id === playerId);
            if (this.selectedPlayer) {
                this.$bvModal.show('player-select-modal');
            }
        },
        saveTeam(evt) {
            evt.preventDefault();
            this.saving = 1;
            this.saveSuccess = false;
            this.saveFailed = false;
            var fantasyTeamPlayers = [];

            for (let [, value] of Object.entries(this.selected)) {
                fantasyTeamPlayers.push({ playerId: Number(value) });
            }
            this.$apollo
                .mutate({
                    mutation: SET_TEAM_LINEUP,
                    variables: {
                        fantasyTeam: {
                            id: Number(this.id),
                            name: this.teamName,
                            fantasyTeamPlayers: fantasyTeamPlayers
                        }
                    }
                })
                .then(() => {
                    this.saveFailed = false;
                    this.saveSuccess = true;
                    this.saving = 0;
                })
                .catch((error) => {
                    this.saveSuccess = false;
                    this.saveFailed = true;
                    this.saveErrors = DisplayErrors(this.$bvToast, error);
                    this.saving = 0;
                });
        },
        playerIsValid(player) {
            let teamCount = 0;
            let positionCount = 0;

            const maxNumberPerPosition = this.league.numberPerPositions.find(x => x.positionType.id === player.positionTypeId);

            for (let i = 0; i < this.fantasyTeam.playerIds.length; i++) {
                const fp = this.fantasyTeam.playerIds[i];
                if (fp == player.id) {
                    return 1;
                }
                const playerInfo = this.playersHistoryByLeague.find(x => x.id == fp);

                if (playerInfo.teamId === player.teamId) {
                    teamCount++;
                    if (teamCount >= this.league.playersPerTeam) {
                        return -1;
                    }
                }
                if (playerInfo.positionTypeId === player.positionTypeId) {
                    positionCount++;
                    if (positionCount >= maxNumberPerPosition.count) {
                        return -1;
                    }
                }
            }
            return 0;
        }
    }
};
</script>
  