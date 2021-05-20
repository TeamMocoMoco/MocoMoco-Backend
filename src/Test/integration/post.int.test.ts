import request from "supertest"
import mongoose from "mongoose"
import App from "../../app"
import PostController from "../../routers/Post/postController"
import SMSController from "../../routers/SMS/SMSController"
import express from "express"
require("dotenv").config()

let app: express.Application
let token: string

beforeAll(async () => {
  // process.env.TOKEN_KEY = "aaa"
  app = new App([new PostController(), new SMSController()]).app
  const response = await request(app).post("/SMS/check").send({
    phone: "01071214552",
    generateRand: "236613",
  })
  console.log(response.body)
  token = response.body.result.user.token
})

describe("POST API Super Test", () => {
  test("포스트 생성 ", async () => {
    const response = await request(app)
      .post("/posts")
      .set("token", token)
      .send({
        title: "test",
        category: "test",
        content: "test",
        position: "프론트",
        language: "javascript",
        personnel: 4,
        hashtag: ["test", "test"],
        location: [36.7, 38.7],
        meeting: "오프라인",
        startDate: "2021-05-18T14:00:00Z",
        dueDate: "2021-05-20T14:00:00Z",
      })
    expect(response.status).toBe(200)
  })

  test("포스트 전체 가져오기 ", async () => {
    const response = await request(app).get("/posts").send({})
    expect(response.status).toBe(200)
    expect(response.body.result.length).toEqual(1)
    console.log(response.body)
  })
})

afterAll(async () => {
  // await dropAllCollections()
  await mongoose.connection.close()
})
