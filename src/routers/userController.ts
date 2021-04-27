import express, { RequestHandler } from "express";
import Controller from "./interfaces/controller";
import User from "../models/User/interface";
import UserModel from "../models/User/model";
import validation from "../middlewares/validation";
import UserDto from "../models/User/dto";
import { Types } from "mongoose";

class UserController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = UserModel;
  private dto = UserDto;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, validation(this.dto), this.createUser);
    this.router.patch(
      `${this.path}/:id`,
      validation(this.dto, true),
      this.updateUser
    );
  }

  private createUser: RequestHandler = async (req, res, next) => {
    const userData: User = req.body;
    const createUser = new this.user(userData);
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
      const user = await UserModel.findByIdAndUpdate(
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
}

export default UserController;
