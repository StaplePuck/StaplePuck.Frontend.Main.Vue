// initial state
const state = () => ({
  fantasyTeam:  JSON.parse(localStorage.getItem("fantasyTeam")) || "{}",
});

// getters
const getters = {
};

// actions
const actions = {
};

// mutations
const mutations = {
  addPlayer(state, playerId) {
    state.fantasyTeam.playerIds.push(Number(playerId));
    localStorage.setItem("fantasyTeams", JSON.stringify(state.fantasyTeam));
  },
  removePlayer(state, playerId) {
    const index = state.fantasyTeam.playerIds.indexOf(Number(playerId));
    if (index > -1) { 
      state.fantasyTeam.playerIds.splice(index, 1); 
      localStorage.setItem("fantasyTeam",JSON.stringify(state.fantasyTeam));
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

    state.fantasyTeam = teamInfo;
    const t = JSON.stringify(state.fantasyTeam);
    localStorage.setItem("fantasyTeam", t);
  },
  updateTeamName(state, fantasyTeamId, name) {
    if (state.fantasyTeams[fantasyTeamId]) {
      state.fantasyTeams[fantasyTeamId].name = name;
      localStorage.setItem("fantasyTeams", state.fantasyTeams);
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
