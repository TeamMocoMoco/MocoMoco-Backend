import { Room, RoomModel } from "../../models/Room";
class RoomService {
  private room = RoomModel;
  constructor() {}

  createRoom = async (roomData: Room, userId: string): Promise<string> => {
    try {
      if (roomData.admin === userId)
        throw new Error("자신의 게시물에는 채팅이 불가능합니다.");
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
  cbeckRoomById = async (roomId: string): Promise<boolean> => {
    try {
      const room = await this.room.findById(roomId);
      if (room) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default RoomService;
