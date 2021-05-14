"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("../../models/Post");
class ScheduleService {
    constructor() {
        this.changeStatus = async () => {
            const real_date = new Date(Date.now());
            await this.postModel.updateMany({ startDate: { $lte: real_date } }, { $set: { status: false } });
        };
        this.postModel = Post_1.PostModel;
    }
}
exports.default = ScheduleService;
