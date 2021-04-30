import express, { RequestHandler } from "express";
import Controller from "./interfaces/controller";
import User from "../models/User/interface";
import UserModel from "../models/User/model";
import UserDto from "../models/User/dto";
import { validation, JwtPhoneValidation } from "../middlewares/validation";
import "dotenv/config";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { truncate } from "node:fs";

class UserController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = UserModel;
  private dto = UserDto;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validation(this.dto),
      JwtPhoneValidation,
      this.createUser
    );
    this.router.patch(
      `${this.path}/:id`,
      validation(this.dto),
      this.updateUser
    );
    // this.router.post(
    //   `${this.path}/login`,
    //   validation(this.dto, true),
    //   this.login
    // );
  }

  // "token": "eyJhbGciOiJIUzI1N"
  private createUser: RequestHandler = async (req, res, next) => {
    const userData: User = req.body;
    const phoneData: User = res.locals.phone

    const userByPhone = await this.user.findOne({ phone: res.locals.phone });
    if (userByPhone) next(new Error("이미 존재하는 전화번호입니다"));
    const createUser = new this.user({ ...userData, phone: phoneData });
    try {
      await createUser.save();
      res.send({ result: createUser });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  private updateUser: RequestHandler = async (req, res, next) => {
    const userUpdateData: User = req.body;
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      next(new Error("오브젝트 아이디가 아닙니다."));
    try {
      const user = await this.user.findByIdAndUpdate(
        id,
        {
          ...userUpdateData,
        },
        { new: true }
      );
      return res.send(user);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  // private login: RequestHandler = async (req, res, next) => {
  //   const userLoginData: User = req.body;
  //   try {
  //     const user = await this.user.findOne({ id: userLoginData.id });
  //     if (!user) next(new Error("아이디 입력이 잘못되었습니다"));
  //     if (user) {
  //       const passwordMatch = await bcrypt.compare(
  //         userLoginData.password,
  //         user.password
  //       );
  //       if (!passwordMatch) next(new Error("비밀번호가 일치하지 않습니다"));
  //       const secret = process.env.TOKEN_KEY || "token";
  //       const token = jwt.sign({ userId: user._id }, secret);
  //       res.send({ result: { user: { token: token } } });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     next(err);
  //   }
  // };
}

export default UserController;
