import { Schema, model, Model } from "mongoose";
import User from "./interface";

const UserSchema = new Schema(
  {
    id: { type: String, required: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    userImg: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<User> = model("user", UserSchema);
export default UserModel;
