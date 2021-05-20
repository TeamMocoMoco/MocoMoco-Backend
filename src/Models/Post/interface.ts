import { Document } from "mongoose";

interface Post extends Document {
  user: string;
  title: string;
  content: string;
  personnel: number;
  meeting: string;
  category: string;
  hashtag: string[];
  location?: number[];
  offLocation?: number[];
  address?: string;
  address_name?: string;
  startDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  participants: string[];
  status: boolean;
}

export default Post;
