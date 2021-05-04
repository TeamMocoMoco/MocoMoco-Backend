import { Schema, model, Model, Types } from "mongoose";
import Post from "./interface";

const PostSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "user", required: true },
    postion: { type: String },
    language: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true },
    personnel: { type: Number, required: true },
    meeting: { type: String, required: true },
    category: { type: String, required: true },
    hashtag: [String],
    location: [Number],
    startDate: { type: Date },
    dueDate: { type: Date },
    participants: { type: [{ type: Types.ObjectId, ref: "user" }] },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const PostModel: Model<Post> = model("post", PostSchema);
export default PostModel;
