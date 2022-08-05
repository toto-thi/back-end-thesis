import Project from "../../models/Project";
import Transaction from "../../models/Transaction";
import { ApolloError } from "apollo-server-express";

export default {
  Query: {
    allTransactions: async () =>
      await Transaction.find().populate("donatedBy").populate("projectID"),
    transactionPerProject: async (_, { id }) =>
      await Transaction.find({ projectID: id })
        .populate("donatedBy")
        .populate("projectID"),
    transactionPerUser: async (_, { walletAddress }) =>
      await Transaction.find({ toWalletID: walletAddress })
        .populate("donatedBy")
        .populate("projectID"),
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
      },
      req
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
          donatedBy,
        });

        let result = await newTransaction.save();

        const response = await Project.findByIdAndUpdate(projectID, {
          $inc: {
            donateAmount: amount,
          },
        });

        await response.save();
        return result.populate("donatedBy");
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
  },
};
