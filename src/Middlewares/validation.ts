import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import express, { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import SMSModel from "../models/SMS/model";
import UserModel from "../models/User/model";
import sanitizeHtml from 'sanitize-html';

interface TokenData {
  userId: string;
  phone: string;
}

export function validation(type: any, skipMissingProperties = false): express.RequestHandler {
  return async (req, res, next) => {
    const errors = await validate(plainToClass(type, req.body), {
      skipMissingProperties,
    });
    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => {
          return error.constraints && Object.values(error.constraints);
        })
        .join(", ");
      next(new Error(message));
    } else {
      next();
    }
  };
}

export const JwtValidation: RequestHandler = async (req, res, next) => {
  const { token } = req.headers;
  if (!token || typeof token === "object") {
    next(new Error("로그인 후 이용 가능한 기능입니다."));
    return;
  }
  try {
    const { userId } = jwt.verify(token, process.env.TOKEN_KEY || "token") as TokenData;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("사용자가 없습니다.");
    }
    res.locals.user = user && user._id.toString();
    next();
  } catch (err) {
    next(new Error("로그인 후 이용 가능한 기능입니다."));
  }
};

export const JwtPhoneValidation: RequestHandler = async (req, res, next) => {
  const { phonetoken } = req.headers;
  if (!phonetoken || typeof phonetoken === "object") {
    next(new Error("로그인 후 이용 가능한 기능입니다."));
    return;
  }
  try {
    const { userId } = jwt.verify(phonetoken, process.env.TOKEN_KEY || "token") as TokenData;
    const sms = await SMSModel.findOne({ phone: userId }).sort("-updatedAt");
    if (!sms) {
      throw new Error("사용자가 없습니다.");
    } else {
      res.locals.phone = sms.phone;
      next();
    }
  } catch (err) {
    next(new Error("로그인 후 이용 가능한 기능입니다."));
  }
};


//XSS 공격 대비 body에 check

export function scriptFilter(body:any){
  const filterBody:any = {}
  for(let key in body){
    filterBody[key] = sanitizeHtml(body[key])
  }
  return filterBody
}