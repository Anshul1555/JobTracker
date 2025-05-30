import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
  mutation AddProfile($input: ProfileInput!) {
    addProfile(input: $input) {
      token
      profile {
        _id
        name
        email
      }
    }
  }
`;


export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($name: String!, $email: String!) {
    updateProfile(name: $name, email: $email) {
      _id
      name
      email
    }
  }
`;


// export const ADD_PROFILE = gql`
//   mutation addProfile($input: ProfileInput!) {
//     addProfile(input: $input) {
//       token
//       profile {
//         _id
//         name
//       }
//     }
//   }
// `;

export const ADD_JOB = gql`
  mutation addJob($profileId: ID!, $job: JobInput!) {
    addJob(profileId: $profileId, job: $job) {
      _id
      name
      jobs {
        title
        company
        link
        status
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const UPDATE_JOB_STATUS = gql`
  mutation UpdateJobStatus($jobId: ID!, $status: String!) {
    updateJobStatus(jobId: $jobId, status: $status) {
      _id
      status
    }
  }
`;

export const DELETE_JOB = gql`
  mutation DeleteJob($jobId: ID!) {
    removeJob(jobId: $jobId) {
      _id
      jobs {
        _id
      }
    }
  }
`;
