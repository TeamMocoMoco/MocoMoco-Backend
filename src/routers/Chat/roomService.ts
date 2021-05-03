import { Room, RoomModel } from "../../models/Room";
import { Post, PostModel } from "../../models/Post";
class RoomService {
  private room = RoomModel;
  private post = PostModel;
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
  checkRoomById = async (roomId: string): Promise<boolean> => {
    try {
      const room = await this.room.findById(roomId);
      if (room) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  };

  getMyRooms = async (userId: string): Promise<Room[]> => {
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
}

export default RoomService;
