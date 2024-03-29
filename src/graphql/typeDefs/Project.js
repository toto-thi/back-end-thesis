import { gql } from "apollo-server-express";

export default gql`
  type Files {
    url: String
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    location: String!
    imageList: [Files]
    referenceDoc: String
    startDate: String!
    endDate: String!
    targetAmount: Float!
    donateAmount: Float!
    createdBy: User!
    contractAddress: String
    createdAt: String!
    updatedAt: String!
    isApproved: Boolean!
    isRejected: Boolean!
    isClose: Boolean!
    isPending: Boolean!
  }

  input FileUpload {
    url: String
  }

  input ProjectInput {
    title: String
    description: String
    location: String
    startDate: String
    endDate: String
    imageList: [FileUpload]
    referenceDoc: String!
    targetAmount: Float
    donateAmount: Float
    updatedAt: String
  }

  extend type Query {
    getAllProjects: [Project]!
    getProjectById(id: ID!): Project!
    getPendingProjects: [Project]!
    getClosedProjects: [Project!]!
    getApprovedProjects: [Project!]!
    getRejectedProjects: [Project!]!
    getProjectByCreator(uid: ID!): [Project]!
    calTotalDonation: Float!
  }

  extend type Mutation {
    addProject(projectInput: ProjectInput!): Project!
    updateProject(id: ID!, projectInput: ProjectInput): Project
    deleteProject(id: ID!): String!
    approveProject(
      id: ID!
      approval: Boolean!
      contractAddress: String!
    ): Boolean!
    rejectProject(id: ID!, rejection: Boolean!): Boolean!
    closeProject(id: ID!): Boolean!
  }
`;
