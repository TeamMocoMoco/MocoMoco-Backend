import Room from "./interface";
import { Schema, model, Model, Types } from "mongoose";

const RoomSchema = new Schema(
  {
    admin: { type: Types.ObjectId, ref: "user", required: true },
    postId: { type: Types.ObjectId, ref: "post", required: true },
    participant: { type: Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const RoomModel: Model<Room> = model("room", RoomSchema);
export default RoomModel;
