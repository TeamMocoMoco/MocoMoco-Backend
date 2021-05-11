import express, { RequestHandler } from "express";
import Controller from "../interfaces/controller";
import { SMS, SMSDTO } from "../../models/SMS";
import { validation } from "../../middlewares/validation";
import SMSService from "./smsService";

export default class SMSController implements Controller {
  public path = "/SMS";
  public router = express.Router();
  private dto = SMSDTO;
  private smsService;
  constructor() {
    this.initializeRoutes();
    this.smsService = new SMSService();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/send`,
      validation(this.dto, true),
      this.sendSMS
    );
    this.router.post(
      `${this.path}/check`,
      validation(this.dto, true),
      this.checkSMS
    );
  }

  // 인증번호 전송
  sendSMS: RequestHandler = async (req, res, next) => {
    const phoneData: SMS = req.body;
    try {
      await this.smsService.sendSMS(phoneData);
      res.send({ result: "success" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  // 인증번호 확인
  private checkSMS: RequestHandler = async (req, res, next) => {
    const checkData: SMS = req.body;
    try {
      const checkResult = await this.smsService.checkSMS(checkData);
      const token = await this.smsService.createToken(checkResult[1]);
      if (checkResult[0]) {
        return res.send({ result: { phone: { token } } });
      } else {
        return res.send({
          result: { user: { _id: checkResult[1], token: token } },
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}
