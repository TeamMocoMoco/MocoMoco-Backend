import { Document } from 'mongoose'

interface SMS extends Document {
    phone: string,
    generateRand: string,
    createdAt: Date,
    updatedAt: Date
}

export default SMS
