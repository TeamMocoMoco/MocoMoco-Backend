import express, { RequestHandler } from "express"
import Controller from "../interfaces/controller"
import { SMS, SMSDTO } from "../../models/SMS"
import { validation } from "../../middlewares/validation"
import SMSService from "./SMSService"

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
      res.send({ result: "success" })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private check: RequestHandler = async (req, res, next) => {
    const checkData: SMS = req.body
    try {
      const checkResult = await this.smsService.check(checkData)
      if (checkResult[0]) {
        const token = await this.smsService.createToken(checkResult[1])
        return res.send({ result: { phone: { token } } })
      } else {
        const token = await this.smsService.createToken(checkResult[1])
        // 어느쪽 토큰이 발행되었는지 res에 표현 해야하나? 아니면 phone/user표시로 괜찮?
        return res.send({ result: { user: { token } } })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

export default SMSController
