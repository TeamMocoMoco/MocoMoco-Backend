"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SMS_1 = require("../../models/SMS");
const User_1 = require("../../models/User");
const smsService_1 = __importDefault(require("../../middlewares/smsService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utile_1 = require("../../middlewares/utile");
class SMSService {
    constructor() {
        this.smsModel = SMS_1.SMSModel;
        this.userModel = User_1.UserModel;
        this.ncp = smsService_1.default;
        this.sendSMS = async (SMSData) => {
            const generateRand = utile_1.rand(100000, 999999);
            const { success, msg, status } = await this.ncp.sendSMS({
                to: SMSData.phone,
                content: `안녕하세요. 모코모코입니다. 휴대폰 인증번호는 ${generateRand}입니다. 좋은 하루 보내시기 바랍니다.`,
                countryCode: "82",
            });
            const createSMS = new this.smsModel({
                ...SMSData,
                generateRand: generateRand,
            });
            await createSMS.save();
        };
        this.checkSMS = async (SMSData) => {
            const sms = await this.smsModel
                .findOne({ phone: SMSData.phone })
                .sort("-updatedAt");
            if (!sms)
                throw new Error("인증하신 전화번호가 아닙니다");
            if (sms.generateRand !== SMSData.generateRand)
                throw new Error("인증번호가 잘못되었습니다");
            const user = await this.userModel.findOne({ phone: SMSData.phone });
            if (user)
                return [false, user._id];
            return [true, sms.phone];
        };
        this.createToken = async (tokenSource) => {
            const secret = process.env.TOKEN_KEY;
            const token = jsonwebtoken_1.default.sign({ userId: tokenSource }, secret);
            return token;
        };
    }
}
exports.default = SMSService;
