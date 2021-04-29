import { plainToClass } from "class-transformer"
import { validate, ValidationError } from "class-validator"
import express, { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import UserModel from "../models/User/model"

interface TokenData {
  userId: string
}

export function validation(type: any, skipMissingProperties = false): express.RequestHandler {
  return async (req, res, next) => {
    const errors = await validate(plainToClass(type, req.body), {
      skipMissingProperties,
    })
    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => {
          return error.constraints && Object.values(error.constraints)
        })
        .join(", ")
      next(new Error(message))
    } else {
      next()
    }
  }
}

export const JwtValidation: RequestHandler = async (req, res, next) => {
  const { token } = req.headers
  if (!token || typeof token === "object") {
    next(new Error("로그인 후 이용 가능한 기능입니다."))
    return
  }
  try {
    const { userId } = jwt.verify(token, process.env.TOKEN_KEY || "token") as TokenData

    const user = await UserModel.findById(userId)
    if (!user) {
      next(new Error("사용자가 없습니다."))
    }
    res.locals.user = user && user._id
    next()
  } catch (err) {
    next(new Error("로그인 후 이용 가능한 기능입니다."))
  }
}
