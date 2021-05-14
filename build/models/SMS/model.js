"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SMSSchema = new mongoose_1.Schema({
    phone: { type: String, required: true },
    generateRand: { type: String, required: true },
}, {
    timestamps: true,
});
// SMSSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3 * 60 })
const SMSModel = mongoose_1.model("SMS", SMSSchema);
exports.default = SMSModel;
