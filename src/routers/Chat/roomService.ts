import { Room, RoomModel } from "../../models/Room";
import { Post, PostModel } from "../../models/Post";
import { Chat, ChatModel } from "../../models/Chat";

class RoomService {
  private room = RoomModel;
  private post = PostModel;
  private chat = ChatModel;
  constructor() {}

  createRoom = async (roomData: Room, userId: string): Promise<string> => {
    try {
      //유효한 postId인지 검사하기
      const post = await this.post.findOne({
        _id: roomData.postId,
        user: roomData.admin,
      });
      if (!post) throw new Error("잘못된 정보가 기재되었습니다.");
      // 자신의 게시물에는 채팅방X
      if (roomData.admin === userId)
        throw new Error("자신의 게시물에는 채팅이 불가능합니다.");
      //이미 채팅방이 생성된 경우
      const room = await this.room.findOne({
        admin: roomData.admin,
        participant: userId,
        postId: roomData.postId,
      });
      if (room) return room._id;
      //새롭게 채팅방 생성하는 경우
      const newRoom = new this.room({
        postId: roomData.postId,
        admin: roomData.admin,
        participant: userId,
      });

      await newRoom.save();
      return newRoom._id;
    } catch (err) {
      throw new Error(err);
    }
  };

  getRooms = async (userId: string): Promise<Room[]> => {
    try {
      const rooms = await this.room
        .find({
          $or: [{ admin: userId }, { participant: userId }],
        })
        .populate("participant name userImg")
        .populate("admin name userImg");
      return rooms;
    } catch (err) {
      throw new Error(err);
    }
  };
  getRoomsLastChat = async (rooms: Room[]): Promise<(Chat | Object)[]> => {
    try {
      let lastChat: (Chat | Object)[] = [];
      const chats = await this.chat.find({}).sort("-createdAt");

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
    } catch (err) {
      throw new Error(err);
    }
  };
  getRoomById = async (roomId: string): Promise<Room | null> => {
    try {
      const room = await this.room
        .findById(roomId)
        .populate("participant name userImg")
        .populate("admin name userImg");
      return room;
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default RoomService;
