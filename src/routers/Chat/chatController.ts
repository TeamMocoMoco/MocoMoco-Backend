import express, { RequestHandler } from "express";
import Controller from "../interfaces/controller";
import { Chat } from "../../models/Chat";
import { Room } from "../../models/Room";
import { JwtValidation } from "../../middlewares/validation";
import ChatService from "./chatService";
import RoomService from "./roomService";
import { Types } from "mongoose";

class ChatController implements Controller {
  public path = "/rooms";
  public router = express.Router();
  private chatService;
  private roomService;

  constructor() {
    this.initializeRoutes();
    this.chatService = new ChatService();
    this.roomService = new RoomService();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/myroom`, JwtValidation, this.getRooms);
    this.router.post(`${this.path}`, JwtValidation, this.createRoom);
    this.router.get(`${this.path}/:roomId`, JwtValidation, this.getRoomById);
    this.router.post(
      `${this.path}/:roomId/chat`,
      JwtValidation,
      this.createChat
    );
  }

  //방 만들기
  private createRoom: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    const roomData: Room = req.body;

    try {
      const roomId = await this.roomService.createRoom(roomData, userId);
      res.send({ result: roomId });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //방 안 채팅 불러오기
  private getRoomById: RequestHandler = async (req, res, next) => {
    const { roomId } = req.params;
    if (!Types.ObjectId.isValid(roomId))
      next(new Error("오브젝트 아이디가 아닙니다."));

    try {
      const roomInfo = await this.roomService.getRoomById(roomId);
      if (!roomInfo) throw new Error("Room이 없습니다.");

      const chat = await this.chatService.getChatById(roomId);
      return res.send({ result: { roomInfo, chat } });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //채팅하기
  private createChat: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    const chatData: Chat = req.body;
    const { roomId } = req.params;
    if (!Types.ObjectId.isValid(roomId))
      next(new Error("오브젝트 아이디가 아닙니다"));

    try {
      const chat = await this.chatService.creatChat(chatData, userId, roomId);
      const duration = 9 * 60 * 60 * 1000;
      chat.createdAt.setTime(chat.createdAt.getTime() + duration);
      // 여기서 소켓을 통해서 보낸다.
      req.app.get("io").of("/chat").to(roomId).emit("chat", chat);
      return res.send({ result: "success" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //내가 속한 채팅방 불러오기
  private getRooms: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    try {
      const rooms = await this.roomService.getRooms(userId);
      const chats = await this.roomService.getRoomsLastChat(rooms);
      return res.send({ result: { rooms: rooms, chats: chats } });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}
export default ChatController;
