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
