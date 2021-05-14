"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_1 = __importDefault(require("./userService"));
const User_1 = require("../../models/User");
const validation_1 = require("../../middlewares/validation");
const mongoose_1 = require("mongoose");
const upload_1 = __importDefault(require("../../middlewares/upload"));
class UserController {
    constructor() {
        this.path = "/auth";
        this.router = express_1.default.Router();
        this.dto = User_1.UserDTO;
        // 유저 생성
        this.createUser = async (req, res, next) => {
            const userData = req.body;
            const phoneData = res.locals.phone;
            try {
                if (userData.role === '개발자') {
                    userData.userImg = 'https://mocomoco.s3.ap-northeast-2.amazonaws.com/original/1620916240861developer.png';
                }
                else if (userData.role === '디자이너') {
                    userData.userImg = 'https://mocomoco.s3.ap-northeast-2.amazonaws.com/original/1620916235923designer.png';
                }
                else if (userData.role === '기획자') {
                    userData.userImg = 'https://mocomoco.s3.ap-northeast-2.amazonaws.com/original/1620916218747director.png';
                }
                else {
                    next(new Error("잘못된 역할입니다."));
                }
                const user = await this.userService.createUser(userData, phoneData);
                return res.send({ result: user });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 로그인
        this.login = async (req, res, next) => {
            const phoneData = res.locals.phone;
            try {
                const { token, user } = await this.userService.login(phoneData);
                return res.send({ result: { user: { _id: user._id, token: token } } });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 유저 정보 업데이트
        this.updateUser = async (req, res, next) => {
            const userId = res.locals.user;
            const userUpdateData = req.body;
            const img = req.file && req.file;
            const imgUrl = img && img.location;
            if (!mongoose_1.Types.ObjectId.isValid(userId))
                next(new Error("오브젝트 아이디가 아닙니다."));
            try {
                await this.userService.updateUser({ ...userUpdateData, userImg: imgUrl }, userId);
                return res.send({ result: "success" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 유저 정보 업데이트
        this.deleteUser = async (req, res, next) => {
            const userId = res.locals.user;
            if (!mongoose_1.Types.ObjectId.isValid(userId))
                next(new Error("오브젝트 아이디가 아닙니다."));
            try {
                const result = await this.userService.checkDelete(userId);
                if (result === false)
                    return new Error("아직 진행중인 글이 있습니다.");
                const user = await this.userService.updateUser({
                    name: "알수없는사용자",
                    phone: "01000000000",
                    role: "알수없는역할",
                    introduce: "",
                    userImg: "https://mocomoco.s3.amazonaws.com/original/1620694702756profile_img.png",
                }, userId);
                return res.send({ result: user });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 내 정보 가지고 오기
        this.getMyPage = async (req, res, next) => {
            const userId = res.locals.user;
            if (!mongoose_1.Types.ObjectId.isValid(userId))
                next(new Error("오브젝트 아이디가 아닙니다"));
            try {
                const me = await this.userService.getUser(userId);
                return res.send({ result: me });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 다른 사용자 정보 가지고 오기
        this.getProfile = async (req, res, next) => {
            const { userId } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(userId))
                next(new Error("오브젝트 아이디가 아닙니다"));
            try {
                const user = await this.userService.getUser(userId);
                return res.send({ result: user });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 사용자가 만든 post
        this.getUserPost = async (req, res, next) => {
            const page = req.query.page || "1";
            const page2 = +page;
            const { userId } = req.params;
            const { status } = req.query;
            if (!mongoose_1.Types.ObjectId.isValid(userId))
                next(new Error("오브젝트 아이디가 아닙니다"));
            try {
                if (status === "true") {
                    const activePost = await this.userService.getUserPost(page2, userId, true);
                    return res.send({ result: activePost });
                }
                else if (status === "false") {
                    const deactivePost = await this.userService.getUserPost(page2, userId, false);
                    return res.send({ result: deactivePost });
                }
                return next(new Error("잘못된 status입니다."));
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 사용자가 참여하는 post
        this.getParticipantPost = async (req, res, next) => {
            const page = req.query.page || "1";
            const page2 = +page;
            const { userId } = req.params;
            const { status } = req.query;
            if (!mongoose_1.Types.ObjectId.isValid(userId))
                next(new Error("오브젝트 아이디가 아닙니다"));
            try {
                if (status === "true") {
                    const activePost = await this.userService.getParticipantsPost(page2, userId, true);
                    return res.send({ result: activePost });
                }
                else if (status === "false") {
                    const deactivePost = await this.userService.getParticipantsPost(page2, userId, false);
                    return res.send({ result: deactivePost });
                }
                return next(new Error("잘못된 status입니다."));
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        this.initializeRoutes();
        this.userService = new userService_1.default();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, validation_1.validation(this.dto), validation_1.JwtPhoneValidation, this.createUser);
        this.router.post(`${this.path}/login`, validation_1.validation(this.dto, true), this.login);
        this.router.patch(`${this.path}`, validation_1.validation(this.dto, true), validation_1.JwtValidation, upload_1.default.single("img"), this.updateUser);
        this.router.delete(`${this.path}`, validation_1.validation(this.dto, true), validation_1.JwtValidation, this.deleteUser);
        this.router.get(`${this.path}`, validation_1.JwtValidation, this.getMyPage);
        this.router.get(`${this.path}/admin/:userId`, this.getUserPost);
        this.router.get(`${this.path}/participant/:userId`, this.getParticipantPost);
        this.router.get(`${this.path}/:userId`, this.getProfile);
    }
}
exports.default = UserController;
