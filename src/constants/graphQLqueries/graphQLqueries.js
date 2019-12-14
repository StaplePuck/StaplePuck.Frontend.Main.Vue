import gql from 'graphql-tag'

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
`