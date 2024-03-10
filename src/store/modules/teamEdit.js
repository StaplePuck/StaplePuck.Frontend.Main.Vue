// initial state
const state = () => ({
  fantasyTeams: {}
});

// getters
const getters = {
};

// actions
const actions = {

};

// mutations
const mutations = {
  addPlayer(state, fantasyTeamId, playerId) {
    if (state.fantasyTeams[fantasyTeamId]) {
      state.fantasyTeams[fantasyTeamId].playerIds.push(playerId);
    }
  },
  removePlayer(state, fantasyTeamId, playerId) {
    if (state.fantasyTeams[fantasyTeamId]) {
      const index = state.fantasyTeams[fantasyTeamId].playerIds.indexOf(playerId);
      if (index > -1) { 
        state.fantasyTeams[fantasyTeamId].playerIds(index, 1); 
      }
    }
  },
  initialTeam(state, fantasyTeam) {
    const teamInfo = {
      id: fantasyTeam.id,
      name: fantasyTeam.name,
      leagueId: fantasyTeam.league.id,
      seasonId: fantasyTeam.league.season.id,
      playerIds: []
    };
    for (let i = 0; i < fantasyTeam.fantasyTeamPlayers.length; i++) {
      const fp = fantasyTeam.fantasyTeamPlayers[i];
      teamInfo.playerIds.push(fp.player.id);
    }
    state.fantasyTeams[fantasyTeam.id] = teamInfo;
  },
  updateTeamName(state, fantasyTeamId, name) {
    if (state.fantasyTeams[fantasyTeamId]) {
      state.fantasyTeams[fantasyTeamId].name = name;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
