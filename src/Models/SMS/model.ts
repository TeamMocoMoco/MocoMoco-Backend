import { Schema, model, Model } from "mongoose";
import SMS from "./interface";

const SMSSchema = new Schema(
    {
        phone: { type: String, required: true },
        generateRand: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

const SMSModel: Model<SMS> = model("SMS", SMSSchema);
export default SMSModel;
