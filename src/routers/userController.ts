import express, { RequestHandler } from "express"
import Controller from "./interfaces/controller"
import User from "../models/User/interface"
import UserModel from "../models/User/model"
import UserDto from "../models/User/dto"
import { validation } from "../middlewares/validation"
import "dotenv/config"
import { Types } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class UserController implements Controller {
  public path = "/auth"
  public router = express.Router()
  private user = UserModel
  private dto = UserDto
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validation(this.dto), this.createUser)
    this.router.patch(`${this.path}/:id`, validation(this.dto, true), this.updateUser)
    this.router.post(`${this.path}/login`, validation(this.dto, true), this.login)
  }

  private createUser: RequestHandler = async (req, res, next) => {
    const userData: User = req.body

    const userById = await this.user.findOne({ id: userData.id })
    if (userById) next(new Error("이미 존재하는 아이디입니다"))
    const userByPhone = await this.user.findOne({ phone: userData.phone })
    if (userByPhone) next(new Error("이미 존재하는 전화번호입니다"))

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const createUser = new this.user({ ...userData, password: hashedPassword })
    try {
      await createUser.save()
      res.send({ result: createUser })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private updateUser: RequestHandler = async (req, res, next) => {
    const userUpdateData: User = req.body
    const { id } = req.params
    if (!Types.ObjectId.isValid(id)) next(new Error("오브젝트 아이디가 아닙니다."))
    try {
      const user = await this.user.findByIdAndUpdate(
        id,
        {
          ...userUpdateData,
        },
        { new: true }
      )
      return res.send(user)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private login: RequestHandler = async (req, res, next) => {
    const userLoginData: User = req.body
    try {
      const user = await this.user.findOne({ id: userLoginData.id })
      if (!user) next(new Error("아이디 입력이 잘못되었습니다"))
      if (user) {
        const passwordMatch = await bcrypt.compare(userLoginData.password, user.password)
        if (!passwordMatch) next(new Error("비밀번호가 일치하지 않습니다"))
        const secret = process.env.TOKEN_KEY || "test"
        const token = jwt.sign({ userId: user._id }, secret)
        res.send({ result: { user: { token: token } } })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

export default UserController
