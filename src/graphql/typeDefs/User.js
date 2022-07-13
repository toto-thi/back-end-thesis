import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    dob: String
    gender: String
    email: String!
    password: String!
    role: String
    imgUrl: String
    tokenVersion: Int
    walletID: String
    createdProject: [Project!]
  }

  input UserInput {
    firstname: String!
    lastname: String!
    dob: String
    gender: String
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
    gender: String
    email: String
    password: String
    imgUrl: String
    walletID: String
  }

  extend type Query {
    getAllUsers: [User!]!
    userProfile(id: ID!): User!
  }

  extend type Mutation {
    createUser(userInput: UserInput!): LoginResponse!
    login(loginInput: LoginInput!): LoginResponse!
    updateUser(id: ID!, updateInput: UpdateInput): User!
    deleteUser(id: ID!): String
    # revokeRefreshTokensForUser(id: ID!): Boolean
  }

  # ERROR HANDLING | will implement after everything is done
`;
