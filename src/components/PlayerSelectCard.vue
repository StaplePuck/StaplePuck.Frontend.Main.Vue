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
            title="{Empty}"
            style="max-width: 20rem;"
            class="mb-2">

        </b-card>
    </div>
    <div v-else>
        <b-card
            :title="player.fullName"
            :img-src="'https://assets.staplepuck.com/headshots/' + player.id + '.png'"
            :img-alt="player.fullName"
            img-top
            style="max-width: 20rem;"
            class="mb-2"
        >
            <b-card-text>
                <img v-bind:src="'https://assets.staplepuck.com/logos/' + player.team.id + '.svg'" width="30" />
                {{ player.team.fullName }}
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
</style>
  