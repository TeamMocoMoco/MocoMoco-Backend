"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    introduce: { type: String },
    userImg: { type: String },
}, {
    timestamps: true,
});
const UserModel = mongoose_1.model("user", UserSchema);
exports.default = UserModel;
