import { gql } from "apollo-server-express";

export default gql`
    extend type Mutation {
        fileUploader(file: Upload!): String!
    }
`