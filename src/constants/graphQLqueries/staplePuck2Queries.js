import gql from "graphql-tag";

export const QUERY_LEAGUE_HISTORY = gql`
  query getLeagueHistory($leagueid: String!) {
    leagueHistoryGetById(LeagueId: $leagueid) {
      AllowMultipleTeams
      Announcement
      Description
      Id
      IsActive
      IsLocked
      Name
      PaymentInfo
      Players {
        ExternalId
        ExternalId2
        FirstName
        FullName
        HScores {
          LeagueId
          PlayerId
          PositionRank
          Rank
          Score
          Scores {
            PositionRank
            Rank
            Score
            ScoringTypeId
          }
          SpanId
        }
        Id
        LastName
        LeagueId
        Number
        PositionType {
          Id
          Name
          ShortName
        }
        PositionTypeId
        ShortName
        Team {
          ExternalId
          ExternalId2
          FullName
          Id
          LocationName
          Name
          SeasonId
          ShortName
        }
        TeamId
      }
      ScoringRules {
        PositionType {
          Id
          Name
          ShortName
        }
        PositionTypeId
        ScoringType {
          Id
          Name
          ShortName
        }
        ScoringTypeId
        ScoringWeight
      }
      SeasonId
      Spans {
        Description
        EndDate
        Id
        LeagueId
        Name
        SeasonId
        StartDate
      }
      Teams {
        ExternalId
        ExternalId2
        FullName
        Id
        LocationName
        Name
        SeasonId
        ShortName
      }
    }
  }`;