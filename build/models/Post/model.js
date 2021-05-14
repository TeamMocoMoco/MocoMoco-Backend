"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "user", required: true },
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
    participants: { type: [{ type: mongoose_1.Types.ObjectId, ref: "user" }] },
    status: { type: Boolean, default: true },
}, {
    timestamps: true,
});
PostSchema.index({ status: 1, meeting: 1 });
const PostModel = mongoose_1.model("post", PostSchema);
exports.default = PostModel;
