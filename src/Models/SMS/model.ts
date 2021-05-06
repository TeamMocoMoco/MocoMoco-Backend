import { Schema, model, Model } from "mongoose"
import SMS from "./interface"

const SMSSchema = new Schema(
  {
    phone: { type: String, required: true },
    generateRand: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

// SMSSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3 * 60 })

const SMSModel: Model<SMS> = model("SMS", SMSSchema)
export default SMSModel
