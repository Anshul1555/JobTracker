const typeDefs = `
  # Represents a job application
  type Job {
    _id: ID!          # Unique identifier for the job
    title: String!    # Job title
    company: String   # Company name
    link: String!     # Link to job listing or company
    status: String    # Application status (e.g., Applied, Interviewing)
  }

  # Represents a user profile
  type Profile {
    _id: ID!          # Unique identifier for the profile
    name: String!     # User's full name
    email: String!    # User's email
    password: String  # Hashed password (not usually exposed in queries)
    jobs: [Job]!      # List of job applications
  }

  # Authentication response containing token and user profile
  type Auth {
    token: ID!        # JWT token
    profile: Profile  # Authenticated user's profile
  }

  # Input for creating/updating a user profile
  input ProfileInput {
    name: String!
    email: String!
    password: String!
    jobs: [JobInput]
  }

  # Input for adding/updating a job
  input JobInput {
    title: String!
    company: String
    link: String!
    status: String
  }

  type Query {
    profiles: [Profile]!              # Fetch all profiles
    profile(profileId: ID!): Profile # Fetch a profile by ID
    me: Profile                      # Fetch currently logged-in user's profile
  }

  type Mutation {
  addProfile(input: ProfileInput!): Auth
  login(email: String!, password: String!): Auth

  addJob(profileId: ID!, job: JobInput!): Profile

  removeProfile: Profile

  removeJob(jobId: ID!): Profile 
  updateProfile(name: String!, email: String!): Profile  


  updateJobStatus(jobId: ID!, status: String!): Job
}
`;
export default typeDefs;
