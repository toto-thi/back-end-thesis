import Project from "../typeDefs/Project";
import User from "../../models/User";
import Transaction from "../../models/Transaction";
import { ApolloError } from "apollo-server-express";

export default {
  Query: {
    allTransactions: async () => await Transaction.find().populate("donatedBy"),
    transactionPerProject: async (_, { id }) =>
      await Transaction.findById(id).populate("donatedBy"),
  },
  Mutation: {
    donate: async (
      _,
      {
        donateInput: {
          txnHash,
          projectID,
          fromWalledID,
          toWalletID,
          amount,
          message,
          donatedBy,
        },
      }
    ) => {},
  },
};
