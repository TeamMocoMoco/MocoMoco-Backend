import express, { RequestHandler } from "express"
import Controller from "../interfaces/controller"
import UserService from "./userService"
import { User, UserDTO } from "../../models/User"
import { validation, JwtPhoneValidation } from "../../middlewares/validation"
import { Types } from "mongoose"

class UserController implements Controller {
  public path = "/auth"
  public router = express.Router()
  private userService
  private dto = UserDTO
  constructor() {
    this.initializeRoutes()
    this.userService = new UserService()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validation(this.dto), JwtPhoneValidation, this.createUser)
    this.router.post(`${this.path}/login`, validation(this.dto, true), this.login)
    this.router.patch(`${this.path}/:id`, validation(this.dto, true), this.updateUser)
  }

  private createUser: RequestHandler = async (req, res, next) => {
    const userData: User = req.body;
    const phoneData: string = res.locals.phone
    try {
      const user = await this.userService.createUser(userData, phoneData)
      return res.send({ result: user })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private login: RequestHandler = async (req, res, next) => {
    const phoneData: string = res.locals.phone

    try {
      const token: string = await this.userService.login(phoneData)
      return res.send({ result: { phone: { token: token } } })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private updateUser: RequestHandler = async (req, res, next) => {
    const userId: string = res.locals.user
    const userUpdateData: User = req.body;

    if (!Types.ObjectId.isValid(userId)) next(new Error("오브젝트 아이디가 아닙니다."))
    try {
      const user = await this.userService.updateUser(userUpdateData, userId)
      return res.send({ result: user })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

export default UserController