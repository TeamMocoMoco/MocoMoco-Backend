import { Schema, model, Model } from "mongoose";
import User from "./interface";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    userImg: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<User> = model("user", UserSchema);
export default UserModel;
