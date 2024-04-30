<template>
    <div class="container">
        <div v-if="loading" class="text-center h3"> 
            Loading... <font-awesome-icon :icon="[ 'fas', 'snowflake']" spin/>
        </div>
        <div v-else>
            <PageSummary :headline="fantasyTeam.name">
                <p>
                    <router-link :to="{ name: 'editTeam', params: { id: id } }">
                        Back to main edit page
                    </router-link>  <br/>
                    Select a player for the <b>{{ positionType.name }}</b> position.
                </p>
            </PageSummary>
            <LeagueRules :leagueId="fantasyTeam.leagueId"></LeagueRules>

            <PlayerSelectDialog :fantasyTeamId="id" :player="selectedPlayer" :league="league" :lastSpot="lastSpot" :includeAdd="includeAdd" :includeRemove="includeRemove" />
            
            <div class="col mb-2 font-weight-bold">
                Stats Date Range:
                <div v-for="(span, index) in spans">
                    <input type="radio" :id="span.id" :value="span.id" v-model="selectedSpan">
                    &nbsp;
                    <label>
                        {{ span.name }}
                    </label>
                </div>
            </div>
            <div class="col">
                <div class="font-weight-bold">
                    Color Key:
                </div>
                <div>
                    <table>
                        <tr class="onTeam">
                            <td class="font-weight-bold">
                                Green:
                            </td>
                            <td>
                                Player on your team
                            </td>
                        </tr>
                        <tr class="invalid">
                            <td class="font-weight-bold">
                                Grey:
                            </td>
                            <td>
                                Player not available
                            </td>
                        </tr>
                        <tr class="sorted">
                            <td class="font-weight-bold">
                                Yellow:
                            </td>
                            <td>
                                Sorted by
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <span class="px-3 mt-3 d-block font-weight-bold">Click on an available player to add them to your team</span>
            <section class="col-md">
                <table class="table table-responsive-md table-bordered cf freeze-col">
                    <thead class="cf">
                        <tr>
                            <th v-for="(col, colID) in computedFields" :key="colID" 
                                v-on:click="sortTable(col.key)"
                                :class="{ sorted: col.key === sortColumn }"
                            >
                            {{ col.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowID) in computedData" :key="rowID" v-bind:class="row.style" v-on:click="showPlayer(row.id)">
                            <td v-for="(col, colID) in computedFields" :key="colID">
                                <div v-if="col.key === 'fullName'">
                                    <img v-bind:src="'https://assets.staplepuck.com/headshots/' + row.id + '.png'" width="30" />
                                    <span class="d-inline-block">
                                        {{ row[col.key] }}
                                    </span>
                                </div>
                                <div v-else-if="col.key === 'team'" class="text-center">
                                    <img v-bind:src="'https://assets.staplepuck.com/logos/' + row.teamId + '.svg'" width="30" />
                                    {{ row[col.key] }}
                                </div>
                                <div v-else>
                                    {{ row[col.key] }}
                                </div>
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
    background-color : #fff3cd;
}

@media only screen and (max-width: 540px) {
    .freeze-col {
        th:first-child, td:first-child
        {
            position:sticky;
            left:0px;
            background-color: #fff;
        }
    }

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
    background-color: #d6d8d9;
    pointer-events: none;
    cursor: default;
}
.onTeam {
    background-color: #d4edda;
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
            selectedSpan: {},
            positionType: {},
            selectedPlayer: {},
            scoringTypes: [],
            includeAdd: false,
            includeRemove: false
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
                key: "team",
                label: "Team"
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
            this.playersHistoryByLeague.filter(x => x.positionTypeId == this.posId).forEach((x) => {
                const row = {};
                row.id = x.id;
                row.teamId = x.team.id;
                row.fullName = x.fullName;
                row.team = x.team.shortName;

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
        },
        lastSpot() {
            if (!this.league || !this.fantasyTeam) {
                return true;
            }
            // Determine last spot
            const maxNumberPerPosition = this.league.numberPerPositions.find(x => x.positionType.id == this.posId);
            let positionCount = 0;
            for (let i = 0; i < this.fantasyTeam.playerIds.length; i++) {
                const fp = this.fantasyTeam.playerIds[i];
                const playerInfo = this.playersHistoryByLeague.find(x => x.id == fp);
                if (playerInfo.positionTypeId == this.posId) {
                    positionCount++;
                }
            }
            return positionCount >= maxNumberPerPosition.count;
        }
    },
    props: ['id', 'posId'],
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
                    this.positionType = this.playersHistoryByLeague.find(x => x.positionTypeId == this.posId)?.positionType;

                    if (!this.positionType) {
                        this.$router.push({ name: "notFound" });
                    }
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
                if (this.fantasyTeam.playerIds.find(x => x == playerId)) {
                    this.includeAdd = false;
                    this.includeRemove = true;
                } else {
                    this.includeAdd = true;
                    this.includeRemove = false;
                }
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
  