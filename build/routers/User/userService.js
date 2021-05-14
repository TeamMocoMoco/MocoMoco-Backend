"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../models/User/");
const Post_1 = require("../../models/Post/");
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    constructor() {
        this.userModel = User_1.UserModel;
        this.postModel = Post_1.PostModel;
        this.createUser = async (userData, phoneData) => {
            const userByPhone = await this.userModel.findOne({ phone: phoneData });
            if (userByPhone)
                throw new Error("이미 존재하는 번호입니다");
            const createUser = new this.userModel({
                ...userData,
                phone: phoneData
            });
            await createUser.save();
            return createUser;
        };
        this.login = async (phoneData) => {
            const user = await this.userModel.findOne({ phone: phoneData });
            if (!user)
                throw new Error("없는 휴대폰 번호입니다");
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.TOKEN_KEY);
            return { token, user };
        };
        this.updateUser = async (userUpdateData, userId) => {
            const user = await this.userModel.findByIdAndUpdate(userId, { ...userUpdateData }, { new: true });
            return user;
        };
        this.checkDelete = async (userId) => {
            const post = await this.postModel.find({ user: userId }).sort("-dueDate");
            const duration = 9 * 60 * 60 * 1000;
            const timeDiff = post[0].dueDate.getTime() - duration - Date.now();
            if (timeDiff > 0) {
                // 아직 dueDate가 지나지 않은 post가 있기 때문에 삭제가 되면 안됨
                return false;
            }
            return true;
        };
        this.getUser = async (userId) => {
            const user = await this.userModel.findById(userId);
            if (!user)
                throw new Error("없는 유저입니다");
            return user;
        };
        this.getUserPost = async (page2, userId, status = true) => {
            const userActivePost = await this.postModel
                .find({ $and: [{ user: userId }, { status: status }] })
                .populate("user", config_1.userInfo)
                .populate("participants", config_1.userInfo)
                .sort("-createdAt")
                .skip((page2 - 1) * 5)
                .limit(5);
            return userActivePost;
        };
        this.getParticipantsPost = async (page2, userId, status = true) => {
            const participantsPost = await this.postModel
                .find({ $and: [{ participants: userId }, { status: status }] })
                .populate("user", config_1.userInfo)
                .populate("participants", config_1.userInfo)
                .sort("-createdAt")
                .skip((page2 - 1) * 5)
                .limit(5);
            return participantsPost;
        };
    }
}
exports.default = UserService;
