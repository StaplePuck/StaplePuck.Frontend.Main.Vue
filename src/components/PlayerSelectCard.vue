<template>
    <div v-if="player.id === -1">
        <b-card
            v-if="player.addPlayer"
            style="max-width: 20rem;"
            class="mb-2">
            <router-link 
                :to="{ name: 'addPlayerByPosition', params: { id: fantasyTeamId, posId: player.positionTypeId } }"
                class="card-link">
                  Add Player
            </router-link>
        </b-card>
        <b-card
            v-else
            style="max-width: 20rem;"
            class="mb-2">
            <b-card-text>
                Player Available
            </b-card-text>
        </b-card>
    </div>
    <div v-else>
        <b-card
            style="max-width: 20rem;"
            class="mb-2 card-p"
        >
            <b-card-text>
                <table>
                    <tbody>
                        <tr>
                            <td colspan="2">
                                <b>{{ player.fullName }}</b>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{ player.team.fullName }}
                            </td>
                        </tr>
                        <tr>
                            <td >
                                <img v-bind:src="'https://assets.staplepuck.com/headshots/' + player.id + '.png'" width="50" />
                            </td>
                            <td>
                                <img v-bind:src="'https://assets.staplepuck.com/logos/' + player.team.id + '.svg'" width="50" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-card-text>
        </b-card>
    </div>
</template>

<script>

export default {
    name: "PlayerSelectCard",
    data() {
        return {
            loading: 0
        };
    },
    props: ["player", "league", "fantasyTeamId"],
    computed: { 
    },
    methods: {
    }
};
</script>

<style scoped lang="scss">
.card-p div {
    padding-left: 0.25rem !important;
    padding-right: 0.25rem !important;
}
</style>
  