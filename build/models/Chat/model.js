"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "user", required: true },
    roomId: { type: String, ref: "room", required: true },
    content: { type: String },
}, {
    timestamps: true,
});
const ChatModel = mongoose_1.model("chat", ChatSchema);
exports.default = ChatModel;
