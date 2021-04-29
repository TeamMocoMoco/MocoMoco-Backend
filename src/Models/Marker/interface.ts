import { Document, Types } from "mongoose"

interface Marker extends Document {
  postId: string
  location: number[]
  createdAt: Date
  updatedAt: Date
}

export default Marker
