import express, { RequestHandler } from "express"
import Controller from "../interfaces/controller"
import UserService from "./userService"
import { User, UserDTO } from "../../models/User"
import { validation, JwtPhoneValidation, JwtValidation } from "../../middlewares/validation"

import { Types } from "mongoose"
import upload from "../../middlewares/upload"

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
    this.router.patch(`${this.path}/:id`, validation(this.dto, true), JwtValidation, upload.single('img'), this.updateUser)
    this.router.get(`${this.path}/:id`, validation(this.dto, true), JwtValidation, this.getMyPage)

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
      return res.send({ result: { user: { token: token } } })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private updateUser: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user
    const userUpdateData: User = req.body;
    const img = req.file && req.file as Express.MulterS3.File
    const imgUrl = img && img.location

    if (!Types.ObjectId.isValid(userId)) next(new Error("오브젝트 아이디가 아닙니다."))
    try {
      const user = await this.userService.updateUser({ ...userUpdateData, userImg: imgUrl }, userId)
      return res.send({ result: user })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private getMyPage: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    if (!Types.ObjectId.isValid(userId))
      next(new Error("오브젝트 아이디가 아닙니다"));
    try {
      const { user, userPost, userActivePost, participantsPost, participantsActivePost } = await this.userService.getMyPage(userId)
      return res.send({ result: { user: user, userPost: userPost, userActivePost: userActivePost, participantsPost: participantsPost, participantsActivePost: participantsActivePost } });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default UserController