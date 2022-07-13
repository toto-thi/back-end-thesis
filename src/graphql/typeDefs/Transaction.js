import { gql } from "apollo-server-express";

export default gql`
  type Transaction {
    id: ID!
    transactionNumber: String!
    projectID: String!
    fromWalletID: String!
    toWalletID: String!
    amount: Int!
    donatedBy: User!
  }

  input DonateInput {
    transactionNumber: String!
    projectID: String!
    fromWalletID: String!
    toWalletID: String!
    amount: Int!
    donatedBy: String!
  }

  extend type Query {
    allTransactions: [Transaction!]!
    transactionPerProject(id: ID!): Transaction!
  }

  extend type Mutation {
    donate(donateInput: DonateInput!): Transaction!
  }
`;
