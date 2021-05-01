import { Document } from "mongoose";

interface Room extends Document {
  admin: string;
  postId: string;
  participant: string;
  createAt: Date;
  updateAt: Date;
}

export default Room;
