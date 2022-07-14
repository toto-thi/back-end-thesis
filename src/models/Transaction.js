import { Schema, model } from "mongoose";

const TransactionSchema = new Schema(
  {
    txnHash: {
      type: String,
      required: true,
    },
    projectID: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
    },
    fromWalletID: {
      type: String,
      required: true,
    },
    toWalletID: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    donatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transactions", TransactionSchema);
export default Transaction;
