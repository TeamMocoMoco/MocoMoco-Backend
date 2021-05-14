"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const validation_1 = require("../../middlewares/validation");
const postService_1 = __importDefault(require("./postService"));
const mapService_1 = __importDefault(require("./mapService"));
const mongoose_1 = require("mongoose");
class PostController {
    constructor() {
        this.path = "/posts";
        this.router = express_1.default.Router();
        this.dto = Post_1.PostDto;
        //게시글 작성
        this.createPost = async (req, res, next) => {
            const userId = res.locals.user;
            const postData = req.body;
            try {
                const newPost = await this.postService.createPost(postData, userId);
                res.send({ result: "success" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //게시글 상세
        this.getPostById = async (req, res, next) => {
            const { postId } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(postId))
                return next(new Error("오브젝트 아이디가 아닙니다."));
            try {
                const post = await this.postService.getPostById(postId);
                return res.send({ result: post });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //게시글 수정
        this.updatePost = async (req, res, next) => {
            const userId = res.locals.user;
            const postUpdateData = req.body;
            const { postId } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(postId))
                return next(new Error("오브젝트 아이디가 아닙니다"));
            try {
                //해당 유저정보와 게시글 id로 찾고, 업데이트
                await this.postService.updatePost(postUpdateData, userId, postId);
                return res.send({ result: "success" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //게시글 삭제
        this.deletePost = async (req, res, next) => {
            const userId = res.locals.user;
            const { postId } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(postId))
                return next(new Error("오브젝트 아이디가 아닙니다."));
            try {
                await this.postService.deletePost(userId, postId);
                return res.send({ result: "success" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //게시글 보기(검색 포함)
        this.getPosts = async (req, res, next) => {
            const page = req.query.page || "1";
            const page2 = +page;
            const meeting = req.query.meeting;
            const category = req.query.category;
            const keyword = req.query.keyword || "";
            try {
                const posts = await this.postService.getPosts(page2, meeting, category, keyword);
                return res.send({ result: posts });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 위치 검색 결과
        this.getLocationSearch = async (req, res, next) => {
            const next_page_token = req.query.token;
            const keyword = req.query.keyword;
            try {
                if (next_page_token) {
                    const locations = await this.mapService.getLocationByToken(next_page_token);
                    return res.send(locations.data);
                }
                if (!keyword) {
                    throw new Error("검색어가 없습니다.");
                }
                const locations = await this.mapService.getLocationBySearch(keyword);
                return res.send(locations.data);
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        // 지도 검색
        this.getPostsInMap = async (req, res, next) => {
            const center = req.query.center;
            if (center) {
                try {
                    const centerNum = await this.mapService.getLatLng(center);
                    const Lat = centerNum.Lat;
                    const Lng = centerNum.Lng;
                    const posts = await this.mapService.getMapPostsByCenter(Lat, Lng);
                    const randomziedPosts = await this.mapService.randomizeLocation(posts);
                    return res.send({ result: randomziedPosts });
                }
                catch (err) {
                    console.log(err);
                    next(err);
                }
            }
        };
        //참여자 추가
        this.addParticipant = async (req, res, next) => {
            const { postId } = req.params;
            const userId = res.locals.user;
            const { participantId } = req.body;
            if (!mongoose_1.Types.ObjectId.isValid(postId))
                return next(new Error("오브젝트 아이디가 아닙니다"));
            try {
                await this.postService.addParticipant(postId, userId, participantId);
                return res.send({ result: "성공적으로 참가자를 추가했습니다!" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //참여자 삭제
        this.deleteParticipant = async (req, res, next) => {
            const { postId } = req.params;
            const userId = res.locals.user;
            const { participantId } = req.body;
            if (!mongoose_1.Types.ObjectId.isValid(postId))
                return next(new Error("오브젝트 아이디가 아닙니다."));
            try {
                await this.postService.deleteParticipant(postId, userId, participantId);
                return res.send({ result: "성공적으로 참가자를 삭제했습니다." });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //게시글 마감(status true -> false)
        this.updatePostStatus = async (req, res, next) => {
            const { postId } = req.params;
            const userId = res.locals.user;
            if (!mongoose_1.Types.ObjectId.isValid(postId))
                return next(new Error("오브젝트 아이디가 아닙니다."));
            try {
                await this.postService.updatePostStatus(postId, userId);
                return res.send({ result: "success" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        this.initializeRoutes();
        this.postService = new postService_1.default();
        this.mapService = new mapService_1.default();
    }
    initializeRoutes() {
        //게시글 작성
        this.router.post(this.path, validation_1.JwtValidation, validation_1.validation(this.dto), this.createPost);
        //게시글 수정
        this.router.patch(`${this.path}/:postId`, validation_1.JwtValidation, validation_1.validation(this.dto, true), this.updatePost);
        this.router.patch(`${this.path}/:postId/status`, validation_1.JwtValidation, this.updatePostStatus); //게시글 마감
        this.router.get(`${this.path}/location`, this.getLocationSearch);
        this.router.get(`${this.path}/map`, this.getPostsInMap);
        this.router.post(`${this.path}/:postId/participants`, validation_1.JwtValidation, this.addParticipant); //참여자 추가하기
        this.router.patch(`${this.path}/:postId/participants`, validation_1.JwtValidation, this.deleteParticipant); //침여자 삭제하기
        this.router.delete(`${this.path}/:postId`, validation_1.JwtValidation, this.deletePost); //게시글 삭제
        this.router.get(`${this.path}/:postId`, this.getPostById); //게시글 상세
        this.router.get(this.path, this.getPosts); //게시글 보기(검색 포함)
    }
}
exports.default = PostController;
