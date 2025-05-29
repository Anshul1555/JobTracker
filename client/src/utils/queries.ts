// src/graphql/queries.ts
import { gql } from '@apollo/client';

// Query to fetch all user profiles and their jobs (admin-level or public list)
export const QUERY_PROFILES = gql`
  query GetAllProfiles {
    profiles {
      _id
      name
      email
      jobs {
        _id
        title
        company
        link
        status
      }
    }
  }
`;

// Query to fetch a single profile by ID (for viewing someone else's profile)
export const QUERY_SINGLE_PROFILE = gql`
  query GetSingleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      email
      jobs {
        _id
        title
        company
        link
        status
      }
    }
  }
`;

// Query to fetch the currently logged-in user's profile and jobs
export const QUERY_ME = gql`
  query GetMyProfile {
    me {
      _id
      name
      email
      jobs {
        _id
        title
        company
        link
        status
      }
    }
  }
`;
