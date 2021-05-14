"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chat_1 = require("../../models/Chat");
class ChatService {
    constructor() {
        this.chatModel = Chat_1.ChatModel;
        this.getChatById = async (roomId) => {
            const contents = await this.chatModel.find({ roomId });
            contents.map((content) => {
                const duration = 9 * 60 * 60 * 1000;
                content.createdAt.setTime(content.createdAt.getTime() + duration);
                return content;
            });
            return contents;
        };
        this.creatChat = async (chatData, userId, roomId) => {
            const chat = new this.chatModel({
                user: userId,
                roomId,
                content: chatData.content,
            });
            await chat.save();
            return chat;
        };
    }
}
exports.default = ChatService;
