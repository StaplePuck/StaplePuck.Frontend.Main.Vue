<template>
    <div 
        v-if="player.id === -1 && player.addPlayer"
        class="col mb-2"
        >
        <div
            v-if="player.addPlayer"
            style="max-width: 20rem;"
            class="card card-p card-no-b">
            <router-link 
                :to="{ name: 'addPlayerByPosition', params: { id: fantasyTeamId, posId: player.positionTypeId } }"
                class="btn btn-warning"
                >
                  Add {{ positionName }}
            </router-link>
        </div>
    </div>
    <div v-else
        class="col mb-2">
        <div class="card card-p">
            <table>
                <tbody>
                    <tr>
                        <td rowspan="2" style="width:15%">
                            <img v-bind:src="'https://assets.staplepuck.com/headshots/' + player.id + '.png'" width="40" />
                        </td>
                        <td rowspan="2" style="width:15%">
                            <img v-bind:src="'https://assets.staplepuck.com/logos/' + player.team.id + '.svg'" width="40" />
                        </td>
                        <td style="width:70%">
                            <b>{{ player.fullName }}</b>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:70%">
                            {{ player.team.fullName }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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
    props: ["player", "league", "fantasyTeamId", "positionName"],
    computed: { 
    },
    methods: {
    }
};
</script>

<style scoped lang="scss">
.card-p {
    cursor: pointer;
}
.card-link {
    text-decoration: underline;
}
.card-no-b {
    border: 0 !important;
}
</style>
  