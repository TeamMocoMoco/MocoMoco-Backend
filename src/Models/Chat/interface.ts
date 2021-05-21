import { Document } from "mongoose"

interface Chat extends Document {
  user: string
  roomId: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export default Chat
