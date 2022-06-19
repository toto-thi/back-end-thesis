import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    dob: String
    email: String!
    password: String!
    role: String
    imgUrl: String
    tokenVersion: Int
    #postedProject: [Project]
  }

  input UserInput {
    firstname: String!
    lastname: String!
    dob: String
    email: String!
    password: String!
    role: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type LoginResponse {
    accessToken: String!
  }

  input UpdateInput {
    firstname: String
    lastname: String
    dob: String
    email: String
    password: String
    imageUrl: String
  }

  # QUERY
  extend type Query {
    fetchUsers: [User!]!
    fetchUserById(id: ID!): User!
  }

  #MUTATION
  extend type Mutation {
    createUser(userInput: UserInput): LoginResponse!
    login(loginInput: LoginInput): LoginResponse!
    updateUser(id: ID!, updateInput: UpdateInput): User!
    deleteUser(id: ID!): String
    # revokeRefreshTokensForUser(id: ID!): Boolean
  }

  # ERROR HANDLING | will implement after everything is done
`;
