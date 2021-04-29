import express, { RequestHandler } from "express"
import Controller from "./interfaces/controller"
import SMS from "../models/SMS/interface"
import SMSModel from "../models/SMS/model"
import SMSDto from "../models/SMS/dto"
import { validation } from "../middlewares/validation"
import "dotenv/config"
import { Types } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ncp from "../middlewares/smsService"
import { NCPClient } from "node-sens"

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
    this.router.post(`${this.path}/sendSMS`, validation(this.dto, true), this.sendSMS)
  }

  private sendSMS: RequestHandler = async (req, res, next) => {
    const userData: SMS = req.body

    const { success, msg, status } = await ncp.sendSMS({
      to: userData.phone,
      content: "안녕하세요. 팀 모코모코에서 인사드립니다. 좋은 개발되고 계신가요?",
      countryCode: "82",
    })
    console.log(success, msg, status)

    // 랜덤 숫자 생성후 generateRand변경
    const createSMS = new this.SMS({ ...userData, generateRand: msg })
    try {
      await createSMS.save()
    } catch (err) {
      console.log(err)
      next(err)
    }
    res.send({ result: true })
  }
}

export default SMSController
