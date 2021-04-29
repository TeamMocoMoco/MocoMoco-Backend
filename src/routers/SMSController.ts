import express, { RequestHandler } from "express"
import Controller from "./interfaces/controller"
import SMS from "../models/SMS/interface"
import SMSModel from "../models/SMS/model"
import SMSDto from "../models/SMS/dto"
import { validation } from "../middlewares/validation"
import "dotenv/config"
import jwt from "jsonwebtoken"
import ncp from "../middlewares/smsService"
import { NCPClient } from "node-sens"
import { rand } from "../middlewares/utile"

class SMSController implements Controller {
  public path = "/SMS"
  public router = express.Router()
  private SMS = SMSModel
  private dto = SMSDto
  private NCP: NCPClient = ncp
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/send`, validation(this.dto, true), this.send)
    this.router.post(`${this.path}/check`, validation(this.dto, true), this.check)
  }

  private send: RequestHandler = async (req, res, next) => {
    const phoneData: SMS = req.body

    try {
      const generateRand = rand(100000, 999999)
      const { success, msg, status } = await ncp.sendSMS({
        to: phoneData.phone,
        content: `안녕하세요. 모코모코입니다. 휴대폰 인증번호는 ${generateRand}입니다. 좋은 하루 보내시기 바랍니다.`,
        countryCode: "82",
      })
      console.log(success, msg, status)
      const createSMS = new this.SMS({ ...phoneData, generateRand: generateRand })
      try {
        await createSMS.save()
        res.send({ result: true })
      } catch (err) {
        console.log(err)
        next(err)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private check: RequestHandler = async (req, res, next) => {
    const checkData: SMS = req.body

    try {
      const sms = await this.SMS.findOne({ phone: checkData.phone }).sort("-updatedAt")
      if (!sms) next(new Error("인증하신 전화번호가 아닙니다"))
      if (sms) {
        if (sms.generateRand !== checkData.generateRand)
          next(new Error("인증번호가 잘못되었습니다"))
        if (sms.generateRand === checkData.generateRand) {
          const secret = process.env.TOKEN_KEY || "test"
          const token = jwt.sign({ phone: sms.phone }, secret)
          // result-user-token에서 user대신 다른 걸 넣어야할까?
          res.send({ result: { user: { token: token } } })
        }
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

export default SMSController
