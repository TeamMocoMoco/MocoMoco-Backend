import { Schema, model, Model, Types } from "mongoose"
import Marker from "./interface"

const MarkerSchema = new Schema(
  {
    postId: { type: Types.ObjectId, ref: "Post" },
    location: { type: [Number] },
  },
  {
    timestamps: true,
  }
)

const PostModel: Model<Marker> = model("marker", MarkerSchema)
export default PostModel
