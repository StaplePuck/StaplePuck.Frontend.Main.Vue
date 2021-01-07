import gql from "graphql-tag";

export const QUERY_ALL_LEAGUES = gql`
  {
    seasons {
      id
      fullName
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
        isPaid
        gM {
          id
          externalId
          name
        }
      }
    }
  }
`;

export const QUERY_SCORES_IN_LEAGUE = gql`
  query leagueScores($leagueid: Int) {
    leagueScores(id: $leagueid) {
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
        isPaid
        gM {
          id
          externalId
          name
        }
      }
    }
  }
`;

export const QUERY_NOT_PAID = gql`
  query fantasyTeamsNotPaid($leagueid: Int) {
    fantasyTeamsNotPaid(id: $leagueid) {
      id
      name
      gM {
        id
        name
      }
    }
  }
`;

export const QUERY_TEAMS_FOR_MANAGE = gql`
  query getleagues($leagueid: ID) {
    leagues(id: $leagueid) {
      id
      name
      description
      announcement
      isLocked
      allowMultipleTeams
      paymentInfo
      fantasyTeams {
        id
        name
        gM {
          id
          name
          email
        }
        isPaid
        isValid
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
      isPaid
      league {
        id
        isLocked
        name
      }
      fantasyTeamPlayers {
        player {
          id
          fullName
        }
        playerSeason {
          team {
            id
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

export const QUERY_SCORING_TYPES_FOR_LEAGUE = gql`
  query scoringTypes($leagueId: Int) {
    scoringTypeHeadersForTeam(id: $leagueId) {
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
      receiveNotifications
      receiveNegativeNotifications
      notificationTokens {
        token
      }
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

export const CREATE_TEAM = gql`
  mutation($fantasyTeam: FantasyTeamInput!) {
    createFantasyTeam(fantasyTeam: $fantasyTeam) {
      id
      message
      success
    }
  }
`;

export const UPDATE_LEAGUE_INFO = gql`
  mutation($league: LeagueUpdateInput!) {
    updateLeague(league: $league) {
      id
      message
      success
    }
  }
`;

export const SET_TEAM_LINEUP = gql`
  mutation($fantasyTeam: FantasyTeamUpdateInput!) {
    updateFantasyTeam(fantasyTeam: $fantasyTeam) {
      id
      success
      message
    }
  }
`;

export const ADD_NOTIFICATION_TOKEN = gql`
  mutation($notificationToken: NotificationTokenInput!) {
    addNotificationToken(notificationToken: $notificationToken) {
      id
      success
      message
    }
  }
`;

export const GET_TEAM_DATA_FOR_EDIT = gql`
  query getTeam($teamid: ID) {
    fantasyTeams(id: $teamid) {
      id
      name
      gM {
        externalId
        id
      }
      fantasyTeamPlayers {
        player {
          id
        }
      }
      league {
        id
        isLocked
        season {
          id
          fullName
          teamSeasons {
            team {
              locationName
              fullName
              id
            }
            playerSeasons {
              player {
                id
                fullName
              }
              positionType {
                name
                shortName
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_LEAGUE_RULES = gql`
  query getLeagueRules($leagueId: ID) {
    leagues(id: $leagueId) {
      id
      scoringRules {
        scoringType {
          id
          name
          shortName
        }
        positionType {
          id
          name
          shortName
        }
        pointsPerScore
      }
      numberPerPositions {
        count
        positionType {
          id
          name
          shortName
        }
      }
    }
  }
`;

export const GET_TEAM_SCORE = gql`
  query getTeamScore($leagueId: ID, $teamId: ID) {
    playerCalculatedScoresForTeam(leagueId: $leagueId, teamId: $teamId) {
      player {
        id
        fullName
      }
      league {
        name
      }
      playerSeason {
        positionType {
          name
          shortName
        }
        team {
          id
          name
        }
        teamStateForSeason {
          gameState
        }
      }
      todaysScore
      score
      numberOfSelectedByTeams
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
`;

export const GET_FANTASY_PLAYERS_FOR_LEAGUE = gql`
  query getMyFantasyTeams($leagueId: ID) {
    myFantasyTeams(leagueId: $leagueId) {
      fantasyTeamPlayers {
        playerId
      }
    }
  }
`;

export const GET_MY_FANTASY_TEAMS = gql`
  query getMyFantasyTeams($leagueId: ID) {
    myFantasyTeams(leagueId: $leagueId) {
      id
      name
      leagueId
      isPaid
      league {
        id
        name
        isActive
        isLocked
      }
      rank
      score
      todaysScore
    }
  }
`;

export const QUERY_GET_CALCULATED_SCORES = gql`
  query getTeamScore(
    $leagueId: [String]
    $orderBy: String!
    $skip: Int
    $take: Int
    $descending: Boolean
    $positionTypes: [String]
  ) {
    playerCalculatedScores(
      where: [
        { path: "league.id", comparison: "equal", value: $leagueId }
        {
          path: "playerSeason.positionTypeId"
          comparison: "in"
          value: $positionTypes
        }
      ]
      skip: $skip
      take: $take
      orderBy: { path: $orderBy, descending: $descending }
    ) {
      player {
        id
        fullName
      }
      league {
        id
        name
      }
      playerSeason {
        positionType {
          name
          shortName
        }
        team {
          id
          name
        }
        teamStateForSeason {
          gameState
        }
      }
      todaysScore
      score
      numberOfSelectedByTeams
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
`;

export const QUERY_GET_LEAGUEPOSITIONS = gql`
  query getLeagueInfo($leaguId: ID) {
    leagues(id: $leaguId) {
      id
      name
      season {
        id
        sport {
          id
          positionTypes {
            id
            name
            shortName
          }
        }
      }
    }
  }
`;
