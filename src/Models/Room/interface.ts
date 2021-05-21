import { Document } from "mongoose"

interface Room extends Document {
  admin: string
  post: string
  participant: string
  removeList: string[]
  createAt: Date
  updateAt: Date
}

export default Room
