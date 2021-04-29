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
    this.router.post(`${this.path}/sendSMS`, validation(this.dto, true), this.sendSMS)
  }

  private sendSMS: RequestHandler = async (req, res, next) => {
    const userData: SMS = req.body

    const generateRand = rand(100000, 999999)
    const { success, msg, status } = await ncp.sendSMS({
      to: userData.phone,
      content: `안녕하세요. 모코모코에서 보내드립니다. 휴대폰 인증번호는 ${generateRand}입니다. 좋은 하루 보내시기 바랍니다.`,
      countryCode: "82",
    })
    console.log(success, msg, status)
    const createSMS = new this.SMS({ ...userData, generateRand: generateRand })
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
