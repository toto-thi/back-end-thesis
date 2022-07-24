import { gql } from "apollo-server-express";

export default gql`
  type Transaction {
    id: ID!
    txnHash: String!
    projectID: String!
    fromWalletID: String!
    toWalletID: String!
    amount: Float!
    message: String
    donatedBy: User!
  }

  input DonateInput {
    txnHash: String!
    projectID: String!
    contractAddress: String!
    fromWalletID: String!
    toWalletID: String!
    amount: Float!
    message: String
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
