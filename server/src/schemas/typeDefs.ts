const typeDefs = `
  type Job {
    title: String!
    company: String
    link: String!
    status: String
  }

  type Profile {
    _id: ID
    name: String
    email: String
    password: String
    jobs: [Job]!
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  input ProfileInput {
    name: String!
    email: String!
    password: String!
  }

  input JobInput {
    title: String!
    company: String
    link: String!
    status: String
  }

  type Query {
    profiles: [Profile]!
    profile(profileId: ID!): Profile
    me: Profile
  }

  type Mutation {
    addProfile(input: ProfileInput!): Auth
    login(email: String!, password: String!): Auth

    addJob(profileId: ID!, job: JobInput!): Profile
    removeProfile: Profile
    removeJob(profileId: ID!, title: String!): Profile
  }
`;

export default typeDefs;
