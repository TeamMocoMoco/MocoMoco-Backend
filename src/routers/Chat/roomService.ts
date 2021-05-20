import { Room, RoomModel } from "../../models/Room";
import { Post, PostModel } from "../../models/Post";
import { ChatModel } from "../../models/Chat";
import { userInfo } from "../../routers/config";

interface filterRoom extends Room {
  lastChat?: string[];
}
class RoomService {
  private roomModel = RoomModel;
  private postModel = PostModel;
  private chatModel = ChatModel;
  constructor() {}

  createRoom = async (roomData: Room, userId: string): Promise<string> => {
    //유효한 postId인지 검사하기
    const post = await this.postModel.findOne({
      _id: roomData.post,
      user: roomData.admin,
    });
    if (!post) throw new Error("잘못된 정보가 기재되었습니다.");

    // 자신의 게시물에는 채팅방X
    if (roomData.admin === userId)
      throw new Error("자신의 게시물에는 채팅이 불가능합니다.");

    //이미 채팅방이 생성된 경우
    const room = await this.roomModel.findOne({
      admin: roomData.admin,
      participant: userId,
      post: roomData.post,
    });
    if (room) return room._id;

    //새롭게 채팅방 생성하는 경우
    const newRoom = new this.roomModel({
      post: roomData.post,
      admin: roomData.admin,
      participant: userId,
    });
    await newRoom.save();
    return newRoom._id;
  };

  getRooms = async (userId: string): Promise<(filterRoom | undefined)[]> => {
    const rooms: filterRoom[] = await this.roomModel
      .find({
        $or: [{ admin: userId }, { participant: userId }],
      })
      .populate("participant", userInfo)
      .populate("admin", userInfo)
      .populate("lastChat")
      .sort("-createdAt");

    const filterRooms = rooms.filter(
      (room) =>
        room.lastChat &&
        room.lastChat?.length > 0 &&
        !room.removeList.includes(userId)
    );

    return filterRooms;
  };

  getRoomById = async (roomId: string): Promise<Room | null> => {
    const room = await this.roomModel
      .findById(roomId)
      .populate("participant", userInfo)
      .populate("admin", userInfo)
      .populate("post", "title");
    return room;
  };

  checkRemove = (room: Room): Boolean => {
    if (room.removeList.length > 0) return true;
    return false;
  };

  getParticipants = async (roomInfo: Room): Promise<Post | null> => {
    const post = await this.postModel
      .findById(roomInfo.post)
      .populate("participants", userInfo)
      .select("participants");
    return post;
  };

  deleteRoomById = async (roomId: string, userId: string): Promise<Room> => {
    const room = await this.roomModel.findByIdAndUpdate(roomId, {
      $push: { removeList: userId },
    });
    if (!room) throw new Error("해당 방이 존재하지 않습니다.");
    return room;
  };
}

export default RoomService;
