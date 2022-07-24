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
          contractAddress,
          fromWalletID,
          toWalletID,
          amount,
          message,
          donatedBy,
        },
      }, req
    ) => {
      if (!req.isAuth) {
        throw new ApolloError("You must be authenticated for this action.");
      }

      try {
        const newTransaction = new Transaction({
          txnHash,
          projectID,
          contractAddress,
          fromWalletID,
          toWalletID,
          amount,
          message,
          donatedBy: donatedBy
        })

        let result = await newTransaction.save()
        return result
      } catch (err) {
        throw new ApolloError(err.message)
      }
    },
  },
};
