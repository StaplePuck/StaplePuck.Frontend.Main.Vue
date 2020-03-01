import gql from "graphql-tag";

export const QUERY_ALL_LEAGUES = gql`
  {
    leagues {
      id
      name
      description
      announcement
      allowMultipleTeams
      season {
        id
        fullName
        sport {
          name
          id
        }
      }
    }
  }
`;

export const QUERY_TEAMS_IN_LEAGUE = gql`
  query getleagues($leagueid: ID) {
    leagues(id: $leagueid) {
      id
      name
      isLocked
      paymentInfo
      announcement
      allowMultipleTeams
      fantasyTeams {
        name
        id
        rank
        score
        todaysScore
        gM {
          externalId
          name
        }
      }
    }
  }
`;

export const QUERY_TEAM = gql`
  query getFantasty($teamid: ID) {
    fantasyTeams(id: $teamid) {
      id
      name
      score
      todaysScore
      rank
      fantasyTeamPlayers {
        player {
          id
          fullName
        }
        playerSeason {
          team {
            name
          }
          teamStateForSeason {
            gameState
          }
          positionType {
            shortName
          }
        }
        playerCalculatedScore {
          todaysScore
          score
          scoring {
            scoringType {
              id
              shortName
              name
            }
            total
            todaysScore
            todaysTotal
            score
          }
        }
      }
    }
  }
`;

export const QUERY_SCORING_TYPES_FOR_TEAM = gql`
  query scoringTypes($teamid: Int) {
    scoringTypeHeadersForTeam(id: $teamid) {
      id
      name
      shortName
    }
  }
`;

export const QUERY_USER_PROFILE = gql`
  {
    currentUser {
      id
      name
      email
      receiveEmails
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation($user: UserInput!) {
    updateUser(user: $user) {
      id
      success
      message
    }
  }
`;
