"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("../../models/Room");
const Post_1 = require("../../models/Post");
const Chat_1 = require("../../models/Chat");
const config_1 = require("../../routers/config");
class RoomService {
    constructor() {
        this.roomModel = Room_1.RoomModel;
        this.postModel = Post_1.PostModel;
        this.chatModel = Chat_1.ChatModel;
        this.createRoom = async (roomData, userId) => {
            //유효한 postId인지 검사하기
            const post = await this.postModel.findOne({
                _id: roomData.postId,
                user: roomData.admin,
            });
            if (!post)
                throw new Error("잘못된 정보가 기재되었습니다.");
            // 자신의 게시물에는 채팅방X
            if (roomData.admin === userId)
                throw new Error("자신의 게시물에는 채팅이 불가능합니다.");
            //이미 채팅방이 생성된 경우
            const room = await this.roomModel.findOne({
                admin: roomData.admin,
                participant: userId,
                postId: roomData.postId,
            });
            if (room)
                return room._id;
            //새롭게 채팅방 생성하는 경우
            const newRoom = new this.roomModel({
                postId: roomData.postId,
                admin: roomData.admin,
                participant: userId,
            });
            await newRoom.save();
            return newRoom._id;
        };
        this.getRooms = async (userId) => {
            const rooms = await this.roomModel
                .find({
                $or: [{ admin: userId }, { participant: userId }],
            })
                .populate("participant", config_1.userInfo)
                .populate("admin", config_1.userInfo)
                .populate("lastChat");
            return rooms;
        };
        this.getRoomsLastChat = async (rooms) => {
            let lastChat = [];
            const chats = await this.chatModel.find({}).sort("-createdAt");
            for (let i = 0; i < rooms.length; i++) {
                let flag = 0;
                for (let j = 0; j < chats.length; j++) {
                    typeof rooms;
                    if (rooms[i]._id == chats[j].roomId) {
                        lastChat.push(chats[j]);
                        flag = 1;
                        break;
                    }
                }
                if (flag === 0) {
                    lastChat.push({});
                }
            }
            return lastChat;
        };
        this.getRoomById = async (roomId) => {
            const room = await this.roomModel
                .findById(roomId)
                .populate("participant", config_1.userInfo)
                .populate("admin", config_1.userInfo);
            return room;
        };
    }
}
exports.default = RoomService;
