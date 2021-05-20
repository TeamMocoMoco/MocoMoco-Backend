import request from "supertest"
import mongoose from "mongoose"
import App from "../../app"
import UserController from "../../routers/User/userController"

const app = new App([new UserController()]).app
const databaseName = "test"

let token: string

describe("User API Super Test", () => {
  test("유저 생성하기", async () => {
    const response = await request(app).post("/auth").set("headers", token).send({})
    expect(response.status).toBe(200)
  })

  test("로그인 하기 ", async () => {
    const response = await request(app).post("/auth").send({})
    expect(response.status).toBe(200)
  })
})

afterAll(async () => {
  // await dropAllCollections()
  await mongoose.connection.close()
})
