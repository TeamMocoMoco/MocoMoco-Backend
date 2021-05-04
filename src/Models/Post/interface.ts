import { Document } from "mongoose";

interface Post extends Document {
  user: string;
  position: string;
  language?: string;
  title: string;
  content: string;
  personnel: number;
  meeting: string;
  category: string;
  hashtag: string[];
  location?: number[];
  startDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  participants: string[];
  status: boolean;
}

export default Post;
