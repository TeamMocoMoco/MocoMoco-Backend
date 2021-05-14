"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
    admin: { type: mongoose_1.Types.ObjectId, ref: "user", required: true },
    postId: { type: mongoose_1.Types.ObjectId, ref: "post", required: true },
    participant: { type: mongoose_1.Types.ObjectId, ref: "user", required: true },
}, { timestamps: true });
RoomSchema.virtual("lastChat", {
    ref: "chat",
    localField: "_id",
    foreignField: "roomId",
    options: { sort: { createdAt: -1 }, perDocumentLimit: 1 }
});
RoomSchema.set("toObject", { virtuals: true });
RoomSchema.set("toJSON", { virtuals: true });
const RoomModel = mongoose_1.model("room", RoomSchema);
exports.default = RoomModel;
