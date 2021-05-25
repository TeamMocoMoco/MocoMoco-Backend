import express, { RequestHandler } from "express";
import Controller from "../interfaces/controller";
import ChatService from "./chatService";
import RoomService from "./roomService";
import { Chat, creatChatDto } from "../../models/Chat";
import { Room, creatRoomDto } from "../../models/Room";
import { JwtValidation, validation } from "../../middlewares/validation";
import { Types } from "mongoose";

export default class ChatController implements Controller {
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
    this.router.post(`${this.path}`, JwtValidation, validation(creatRoomDto), this.createRoom);
    this.router.get(`${this.path}/:roomId`, JwtValidation, this.getRoomById);
    this.router.post(
      `${this.path}/:roomId/chat`,
      JwtValidation,
      validation(creatChatDto),
      this.createChat
    );
    this.router.delete(`${this.path}/:roomId`, JwtValidation, this.deleteRoom);
  }

  //방 만들기
  private createRoom: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    const roomData: Room = req.body;

    try {
      const roomId = await this.roomService.createRoom(roomData, userId);
      res.send({ result: roomId });
    } catch (err) {
      next(err);
    }
  };

  //방 안 채팅 불러오기
  private getRoomById: RequestHandler = async (req, res, next) => {
    const { roomId } = req.params;
    if (!Types.ObjectId.isValid(roomId)) next(new Error("오브젝트 아이디가 아닙니다."));

    try {
      const roomInfo = await this.roomService.getRoomById(roomId);
      if (!roomInfo) throw new Error("Room이 없습니다.");
      const removeCheck = this.roomService.checkRemove(roomInfo);
      const chat = await this.chatService.getChatById(roomId);
      const participants = await this.roomService.getParticipants(roomInfo);
      return res.send({
        result: { roomInfo, removeCheck, chat, participants },
      });
    } catch (err) {
      next(err);
    }
  };

  //채팅하기
  private createChat: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    const chatData: Chat = req.body;
    const { roomId } = req.params;
    if (!Types.ObjectId.isValid(roomId)) next(new Error("오브젝트 아이디가 아닙니다"));

    try {
      const chat = await this.chatService.creatChat(chatData, userId, roomId);
      // 여기서 소켓을 통해서 보낸다.
      req.app.get("io").of("/chat").to(roomId).emit("chat", chat);
      return res.send({ result: "success" });
    } catch (err) {
      next(err);
    }
  };

  //내가 속한 채팅방 불러오기
  private getRooms: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    try {
      const rooms = await this.roomService.getRooms(userId);
      return res.send({ result: { rooms: rooms } });
    } catch (err) {
      next(err);
    }
  };

  //채팅방 삭제
  private deleteRoom: RequestHandler = async (req, res, next) => {
    const { roomId } = req.params;
    const userId = res.locals.user;
    try {
      const room = await this.roomService.deleteRoomById(roomId, userId);
      if (room) return res.send({ result: "success" });
    } catch (err) {
      next(err);
    }
  };
}
