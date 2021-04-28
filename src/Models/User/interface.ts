import { Document } from "mongoose";

interface User extends Document {
  id: string;
  password: string;
  name: string;
  phone: string;
  userImg?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
