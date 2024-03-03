import gql from "graphql-tag";

export const QUERY_SPANS = gql`
 query getSpans($leagueId: ID!) {
  spans(leagueId: $leagueId) {
    id
    name
    description
    leagueId
    seasonId
    startDate
    endDate
  }
}`;

export const QUERY_LEAGUE = gql`
  query getLeague($leagueId: ID!) {
    league(leagueId: $leagueId) {
      id
      name
      description
      paymentInfo
      announcement
      isActive
      isLocked
      allowMultipleTeams
      playersPerTeam
      numberPerPositions {
        count
        positionType {
          id
          name
          shortName
        }
      }
      scoringRules {
        positionType {
          id
          name
          shortName
        }
        positionTypeId
        scoringType {
          id
          name
          shortName
        }
        scoringTypeId
        scoringWeight
      }
    }
}`;

export const QUERY_PLAYERS_BY_SEASON = gql`
  query getPlayersBySeason($seasonId: ID!) {
    playersBySeason(seasonId: $seasonId) {
      id
      fullName
      shortName
      firstName
      lastName
      number
      externalId
      externalId2
      positionType {
        id
        name
        shortName
      }
      team {
        id
        name
        fullName
        shortName
        locationName
        externalId
        externalId2
      }
    }
  }
`;

export const QUERY_TEAMS_BY_SEASON = gql`
  query getTeamsBySeason($seasonId: ID!) {
    teamsBySeason(seasonId: $seasonId) {
      id
      name
      fullName
      shortName
      locationName
      externalId
      externalId2
    }
  }
`;

export const QUERY_PLAYERS_HISTORY_BY_LEAGUE = gql`
  query getPlayersHistoryByLeague($leagueId: ID!) {
    playersHistoryByLeague(leagueId: $leagueId) {
      id
      fullName
      shortName
      firstName
      lastName
      number
      externalId
      externalId2
      positionTypeId
      positionType {
        id
        name
        shortName
      }
      teamId
      team {
        id
        name
        fullName
        shortName
        locationName
        externalId
        externalId2
      }
      hScores {
        leagueId
        playerId
        spanId
        rank
        positionRank
        score
        scores {
          score
          rank
          positionRank
          scoringType {
            id
            name
            shortName
          }
        }
      }
    }
  }
`;