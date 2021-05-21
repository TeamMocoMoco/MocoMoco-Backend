import Room from "./interface"
import { Schema, model, Model, Types } from "mongoose"

const RoomSchema = new Schema(
  {
    admin: { type: Types.ObjectId, ref: "user", required: true },
    post: { type: Types.ObjectId, ref: "post", required: true },
    participant: { type: Types.ObjectId, ref: "user", required: true },
    removeList: { type: [{ type: Types.ObjectId, ref: "user" }] },
  },
  { timestamps: true }
)

RoomSchema.virtual("lastChat", {
  ref: "chat",
  localField: "_id", // roomSchema에서 참조하는 것
  foreignField: "roomId", // chatSchema에서 참자하는 것이다.
  options: { sort: { createdAt: -1 }, perDocumentLimit: 1 },
})

RoomSchema.set("toObject", { virtuals: true })
RoomSchema.set("toJSON", { virtuals: true })

const RoomModel: Model<Room> = model("room", RoomSchema)
export default RoomModel
