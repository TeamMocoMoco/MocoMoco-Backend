import mongoose from "mongoose"
import { dropAllCollections, removeAllCollections } from "../../test-setup"
import UserService from "../../../routers/User/userService"
import { User } from "../../../models/User"
import "dotenv/config"
const databaseName = "test"

const me: any = {
  name: "kks",
  phone: "01077775555",
  role: "개발자",
}

const you: any = {
  name: "hhs",
  phone: "01011112222",
  role: "개발자",
}

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
})

describe("유저 생성 및 유저 로그인 기능 테스트 하기", () => {
  const userService = new UserService()

  test("유저 생성", async () => {
    //act
    const newUser = await userService.createUser(me, me.phone)
    const newUser2 = await userService.createUser(you, you.phone)
    // assert
    expect(newUser.phone).toEqual(me.phone)
  })

  test("로그인", async () => {
    //act
    const result = await userService.login(me.phone)
    const meToken: string = result.token
    const meUser: User = result.user

    //assert
    expect(me.phone).toEqual(meUser.phone)
    expect(me.phone).not.toEqual(you.phone)
    expect(async () => {
      await userService.login("000")
    }).rejects.toThrow("없는 휴대폰 번호입니다")
  })
})

afterAll(async () => {
  await dropAllCollections()
  await mongoose.connection.close()
})
