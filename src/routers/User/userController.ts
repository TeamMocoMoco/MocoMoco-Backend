import express, { RequestHandler } from "express"
import Controller from "../interfaces/controller"
import UserService from "./userService"
import { User, UserDTO } from "../../models/User"
import { validation, JwtPhoneValidation, JwtValidation } from "../../middlewares/validation"

import { Types } from "mongoose"
import upload from "../../middlewares/upload"

export default class UserController implements Controller {
  public path = "/auth"
  public router = express.Router()
  private userService
  private dto = UserDTO
  constructor() {
    this.initializeRoutes()
    this.userService = new UserService()
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validation(this.dto),
      JwtPhoneValidation,
      this.createUser
    )
    this.router.post(`${this.path}/login`, validation(this.dto, true), this.login)
    this.router.patch(
      `${this.path}`,
      validation(this.dto, true),
      JwtValidation,
      upload.single("img"),
      this.updateUser
    )
    this.router.delete(`${this.path}`, validation(this.dto, true), JwtValidation, this.deleteUser)
    this.router.get(`${this.path}`, JwtValidation, this.getMyPage)
    this.router.get(`${this.path}/:userId`, this.getProfile)
    this.router.get(`${this.path}/admin/:userId`, this.getMyPost)
    this.router.get(`${this.path}/participant/:userId`, this.getPareticipatePost)
  }

  // 유저 생성
  private createUser: RequestHandler = async (req, res, next) => {
    const userData: User = req.body
    const phoneData: string = res.locals.phone
    try {
      const user = await this.userService.createUser(userData, phoneData)
      return res.send({ result: user })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 로그인
  private login: RequestHandler = async (req, res, next) => {
    const phoneData: string = res.locals.phone

    try {
      const { token, user } = await this.userService.login(phoneData)
      return res.send({ result: { user: { _id: user._id, token: token } } })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 유저 정보 업데이트
  private updateUser: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user
    const userUpdateData: User = req.body
    const img = req.file && (req.file as Express.MulterS3.File)
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

  // 유저 정보 업데이트
  private deleteUser: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user

    if (!Types.ObjectId.isValid(userId)) next(new Error("오브젝트 아이디가 아닙니다."))
    try {
      const result = await this.userService.checkDelete(userId)
      if (result === false) next(new Error("아직 진행중인 글이 있습니다."))
      const user = await this.userService.updateUser(
        {
          name: "알수없는사용자",
          phone: "01000000000",
          role: "알수없는역할",
          introduce: "",
          userImg: "https://mocomoco.s3.amazonaws.com/original/1620694702756profile_img.png",
        },
        userId
      )
      return res.send({ result: user })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 내 정보 가지고 오기
  private getMyPage: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user
    if (!Types.ObjectId.isValid(userId)) next(new Error("오브젝트 아이디가 아닙니다"))
    try {
      const me = await this.userService.getUser(userId)
      return res.send({ result: me })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 다른 사용자 정보 가지고 오기
  private getProfile: RequestHandler = async (req, res, next) => {
    const { userId } = req.params
    if (!Types.ObjectId.isValid(userId)) next(new Error("오브젝트 아이디가 아닙니다"))
    try {
      const user = await this.userService.getUser(userId)
      return res.send({ result: user })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 사용자가 만든 post
  private getMyPost: RequestHandler = async (req, res, next) => {
    const myId = res.locals.user
    const { userId } = req.params
    const { active } = req.query

    if (!Types.ObjectId.isValid(userId)) next(new Error("오브젝트 아이디가 아닙니다"))
    try {
      if (userId) {
        if (active) {
          const activePost = await this.userService.getUserPost(userId, true)
          return res.send({ result: activePost })
        }
        const deactivePost = await this.userService.getUserPost(userId, false)
        return res.send({ result: deactivePost })
      }

      if (active) {
        const activePost = await this.userService.getUserPost(myId, true)
        return res.send({ result: activePost })
      }
      const deactivePost = await this.userService.getUserPost(myId, false)
      return res.send({ result: deactivePost })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 사용자가 참여하는 post
  private getPareticipatePost: RequestHandler = async (req, res, next) => {
    const myId = res.locals.user
    const { userId } = req.params
    const { active } = req.query

    if (!Types.ObjectId.isValid(userId)) next(new Error("오브젝트 아이디가 아닙니다"))
    try {
      if (userId) {
        if (active) {
          const activePost = await this.userService.getParticipantsPost(userId, true)
          return res.send({ result: activePost })
        }
        const deactivPost = await this.userService.getParticipantsPost(userId, false)
        return res.send({ result: deactivPost })
      }
      if (active) {
        const activePost = await this.userService.getParticipantsPost(myId, true)
        return res.send({ result: activePost })
      }
      const deactivPost = await this.userService.getParticipantsPost(myId, false)
      return res.send({ result: deactivPost })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
