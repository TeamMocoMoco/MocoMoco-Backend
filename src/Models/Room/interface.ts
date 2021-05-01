import { Document } from "mongoose"

interface Room extends Document {
  admin: string
  postID: string
  participant: string
  createAt: Date
  updateAt: Date
}

export default Room
