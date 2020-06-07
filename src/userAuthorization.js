export function UserIsLeagueOwner(leagueId, scope) {
  if (scope == null) {
    return false;
  }
  var siteName = process.env.VUE_APP_SITE_NAME;
  const groupName = "League:" + siteName + ":" + leagueId;
  var list = scope.split(" ");
  return list.includes(groupName);
}

export function UserIsTeamOwner(teamId, scope) {
  if (scope == null) {
    return false;
  }
  var siteName = process.env.VUE_APP_SITE_NAME;
  const groupName = "Team:" + siteName + ":" + teamId;
  var list = scope.split(" ");
  return list.includes(groupName);
}
