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
        "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    walletID: {
      type: String,
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
