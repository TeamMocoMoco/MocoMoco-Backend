"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatService_1 = __importDefault(require("./chatService"));
const roomService_1 = __importDefault(require("./roomService"));
const validation_1 = require("../../middlewares/validation");
const mongoose_1 = require("mongoose");
class ChatController {
    constructor() {
        this.path = "/rooms";
        this.router = express_1.default.Router();
        //방 만들기
        this.createRoom = async (req, res, next) => {
            const userId = res.locals.user;
            const roomData = req.body;
            try {
                const roomId = await this.roomService.createRoom(roomData, userId);
                res.send({ result: roomId });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //방 안 채팅 불러오기
        this.getRoomById = async (req, res, next) => {
            const { roomId } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(roomId))
                next(new Error("오브젝트 아이디가 아닙니다."));
            try {
                const roomInfo = await this.roomService.getRoomById(roomId);
                if (!roomInfo)
                    throw new Error("Room이 없습니다.");
                const chat = await this.chatService.getChatById(roomId);
                return res.send({ result: { roomInfo, chat } });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //채팅하기
        this.createChat = async (req, res, next) => {
            const userId = res.locals.user;
            const chatData = req.body;
            const { roomId } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(roomId))
                next(new Error("오브젝트 아이디가 아닙니다"));
            try {
                const chat = await this.chatService.creatChat(chatData, userId, roomId);
                const duration = 9 * 60 * 60 * 1000;
                chat.createdAt.setTime(chat.createdAt.getTime() + duration);
                // 여기서 소켓을 통해서 보낸다.
                req.app.get("io").of("/chat").to(roomId).emit("chat", chat);
                return res.send({ result: "success" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        //내가 속한 채팅방 불러오기
        this.getRooms = async (req, res, next) => {
            const userId = res.locals.user;
            try {
                const rooms = await this.roomService.getRooms(userId);
                // const chats = await this.roomService.getRoomsLastChat(rooms);
                return res.send({ result: { rooms: rooms } });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        };
        this.initializeRoutes();
        this.chatService = new chatService_1.default();
        this.roomService = new roomService_1.default();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/myroom`, validation_1.JwtValidation, this.getRooms);
        this.router.post(`${this.path}`, validation_1.JwtValidation, this.createRoom);
        this.router.get(`${this.path}/:roomId`, validation_1.JwtValidation, this.getRoomById);
        this.router.post(`${this.path}/:roomId/chat`, validation_1.JwtValidation, this.createChat);
    }
}
exports.default = ChatController;
