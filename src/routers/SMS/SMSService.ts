import { SMS, SMSModel, SMSDTO } from "../../models/SMS";
import { UserModel } from "../../models/User";
import NCP from "../../middlewares/smsService";
import { NCPClient } from "node-sens";
import jwt from "jsonwebtoken";
import { rand } from "../../middlewares/utile";

type boolTokenSource = [boolean, string];

class SMSService {
  private smsModel = SMSModel;
  private userModel = UserModel;
  private ncp: NCPClient = NCP;
  constructor() { }

  sendSMS = async (SMSData: SMS): Promise<void> => {
    try {
      const generateRand = rand(100000, 999999);
      const { success, msg, status } = await this.ncp.sendSMS({
        to: SMSData.phone,
        content: `안녕하세요. 모코모코입니다. 휴대폰 인증번호는 ${generateRand}입니다. 좋은 하루 보내시기 바랍니다.`,
        countryCode: "82",
      });

      console.log(success, msg, status);

      const createSMS = new this.smsModel({
        ...SMSData,
        generateRand: generateRand,
      });
      await createSMS.save();
    } catch (err) {
      throw new Error(err);
    }
  };

  checkSMS = async (SMSData: SMS): Promise<boolTokenSource> => {
    try {
      const sms = await this.smsModel
        .findOne({ phone: SMSData.phone })
        .sort("-updatedAt");
      if (!sms) throw new Error("인증하신 전화번호가 아닙니다");
      if (sms.generateRand !== SMSData.generateRand)
        throw new Error("인증번호가 잘못되었습니다");

      const user = await this.userModel.findOne({ phone: SMSData.phone });
      if (user) return [false, user._id];
      return [true, sms.phone];
    } catch (err) {
      throw new Error(err);
    }
  };

  createToken = async (tokenSource: string): Promise<string> => {
    try {
      const secret = process.env.TOKEN_KEY as string;
      const token = jwt.sign({ userId: tokenSource }, secret);
      return token
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default SMSService;
