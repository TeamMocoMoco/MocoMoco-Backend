import { Schema, model, Model, Types } from "mongoose"
import Chat from "./interface"

const ChatSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "user", required: true },
    roomId: { type: String, ref: "room", required: true },
    content: { type: String },
  },
  {
    timestamps: true,
  }
)

const ChatModel: Model<Chat> = model("chat", ChatSchema)
export default ChatModel
