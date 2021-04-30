import express, { RequestHandler } from "express"
import Controller from "../interfaces/controller"
import { SMS, SMSDTO } from "../../models/SMS"
import { validation } from "../../middlewares/validation"
import SMSService from "./SMSService"
import { isPhoneNumber } from "class-validator"

class SMSController implements Controller {
  public path = "/SMS"
  public router = express.Router()
  private dto = SMSDTO
  private smsService
  constructor() {
    this.initializeRoutes()
    this.smsService = new SMSService()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/send`, validation(this.dto, true), this.send)
    this.router.post(`${this.path}/check`, validation(this.dto, true), this.check)
  }

  private send: RequestHandler = async (req, res, next) => {
    const phoneData: SMS = req.body
    try {
      await this.smsService.send(phoneData)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private check: RequestHandler = async (req, res, next) => {
    const checkData: SMS = req.body
    try {
      const token = await this.smsService.check(checkData)
      return res.send({ result: { phone: { token } } })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

export default SMSController
