import request from "supertest"
import mongoose from "mongoose"
import App from "../../app"
import { removeSelectCollections } from "../test-setup";
import SMSController from "../../routers/SMS/SMSController"
import { SMSModel } from "../../models/SMS"
import UserController from "../../routers/User/userController"
import { UserModel } from "../../models/User"
import { removeAllCollections } from "../test-setup"

const app = new App([new UserController(), new SMSController]).app
const databaseName = "test"

let phonetoken: string
let token: string

const phone = {
  "phone": "01029941836"
}

describe("SMS API Super Test", () => {

  test("SMS 보내기", async () => {
    const response = await request(app).post("/SMS/send").send(phone)
    expect(response.status).toBe(200)
  })

  test("SMS 확인", async () => {
    const sms = await SMSModel.find({ phone: phone.phone });
    const SMSData = {
      "phone": phone.phone,
      "generateRand": sms[0].generateRand
    }

    const response = await request(app).post("/SMS/check").send(SMSData)
    expect(response.status).toBe(200)

    phonetoken = response.body.result.phone.token
  })
})


describe("User API Super Test", () => {
  test("유저 생성하기", async () => {
    const userData = {
      "name": "test1",
      "role": "개발자"
    }

    const response = await request(app).post("/auth/register").set("phonetoken", phonetoken).send(userData)
    expect(response.status).toBe(200)
  })

  test("로그인하기", async () => {
    const response = await request(app).post("/auth/login").set("phonetoken", phonetoken)
    expect(response.status).toBe(200)
    token = response.body.result.user.token
  })

  test("유저 업데이트하기", async () => {
    const updateData = {
      "name": "updatedtest1",
      "introduce": "updatedintroduce"
    }

    const response = await request(app).patch("/auth").set("token", token).send(updateData)
    expect(response.status).toBe(200)
  })

  test("내 정보 가져오기", async () => {
    const response = await request(app).get("/auth").set("token", token)
    expect(response.status).toBe(200)
  })

  test("다른 사용자 정보 가져오기", async () => {
    const user = await UserModel.find({ phone: phone.phone });

    const response = await request(app).get(`/auth/${user[0]._id}`)
    expect(response.status).toBe(200)
  })

  test("사용자가 만든 글 가져오기", async () => {
    const user = await UserModel.find({ phone: phone.phone });
    const status = true
    const page = 1

    const response = await request(app).get(`/auth/admin/${user[0]._id}?status=${status}&page=${page}`)
    expect(response.status).toBe(200)
  })

  test("사용자가 참여하는 글 가져오기", async () => {
    const user = await UserModel.find({ phone: phone.phone });
    const status = true
    const page = 1

    const response = await request(app).get(`/auth/participant/${user[0]._id}?status=${status}&page=${page}`)
    expect(response.status).toBe(200)
  })

  test("계정 삭제하기", async () => {
    const response = await request(app).delete('/auth').set("token", token)
    expect(response.status).toBe(200)
  })
})

afterAll(async () => {
  await removeSelectCollections("users");
  await removeSelectCollections("sms");
  await mongoose.connection.close()
})
