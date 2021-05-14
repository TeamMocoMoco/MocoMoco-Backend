import { Schema, model, Model, Types } from "mongoose";
import Post from "./interface";

const PostSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "user", required: true },
    position: { type: String },
    language: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true },
    personnel: { type: Number, required: true },
    meeting: { type: String, required: true },
    category: { type: String, required: true },
    hashtag: [String],
    location: [Number],
    address: { type: String },
    address_name: { type: String },
    startDate: { type: Date },
    dueDate: { type: Date },
    participants: { type: [{ type: Types.ObjectId, ref: "user" }] },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ status: 1, meeting: 1 });

const PostModel: Model<Post> = model("post", PostSchema);
export default PostModel;
