import { gql } from "apollo-server-express";

export default gql`
    type Project {
        id: ID!
        title: String!
        description: String!
        imageList: String
        startDate: String!
        endDate: String!
        targetAmount: Int!
        createdBy: User!
        createdAt: String!
        updatedAt: String!
    }

    input ProjectInput {
        title: String!
        description: String!
        imageList: String
        startDate: String!
        endDate: String!
        targetAmount: Int!
        updatedAt: String!
    }

    extend type Query {
        getAllProjects: [Project!]!
        getProjectById(id: ID!): Project!
    }

    extend type Mutation{
        addProject(projectInput: ProjectInput!): Project!
        updateProject(id: ID!, projectInput: ProjectInput): Project!
        deleteProject(id: ID!): String!
    }
`;