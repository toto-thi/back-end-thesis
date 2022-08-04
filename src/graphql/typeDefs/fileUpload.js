import { gql } from "apollo-server-express";

export default gql`
  type File {
    url: String!
  }

  extend type Mutation {
    fileUploader(file: Upload!): String!
    multipleFileUploader(files: [Upload]!): [File]!
  }
`;
