import { Document } from "mongoose";

interface User extends Document {
  name: string;
  phone: string;
  userImg?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
