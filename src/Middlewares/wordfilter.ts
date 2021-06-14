import express, { RequestHandler } from "express";

const badWords = ["바보", "멍청이"]

const wordFilter: RequestHandler = async (req, res, next) => {
  const body = req.body
  try {
    for (let key in body) {
      for (let j = 0; j < badWords.length; j++) {
        if (body[key].length >= badWords[j].length) {
          if (body[key].indexOf(badWords[j]) !== -1) {
            body[key] = body[key].replace(badWords[j], "**")
          }
        }
      }
    }
    next()
  } catch (err) {
    next(new Error("비속어 필터 중 문제가 생겼습니다."))
  }
};

export default wordFilter