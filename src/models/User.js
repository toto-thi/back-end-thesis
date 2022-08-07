import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "member",
    },
    imgUrl: {
      type: String,
      default:
        "https://wilcity.com/wp-content/uploads/2020/06/115-1150152_default-profile-picture-avatar-png-green.jpg",
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    walletID: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdProject: [{
      type: Schema.Types.ObjectId,
      ref: 'Projects'
    }]
  },
  {
    timestamps: true,
  }
);

const User = model("Users", UserSchema);
export default User;
