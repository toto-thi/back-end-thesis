import { Schema, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true
    },
    imageList: {
      type: Array,
      required: false,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    donateAmount: {
      type: Number,
      default: 0,
    },
    isPending: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isClose: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    contractAddress: {
      type: String,
    },
    referenceDoc: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Project = model('Projects', ProjectSchema);
export default Project;