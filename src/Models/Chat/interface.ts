import { Document } from "mongoose"

interface Chat extends Document {
  user: string
  roomID: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export default Chat
