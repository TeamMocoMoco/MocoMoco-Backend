import express, { NextFunction, Request, Response } from "express";
import Controller from "./interfaces/controller";
import User from "../models/User/interface";
import UserModel from "../models/User/model";
import { nextTick } from "node:process";

class UserController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.createUser);
  }

  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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
}

export default UserController;
