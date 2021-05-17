import mongoose from "mongoose"
import { dropAllCollections, removeAllCollections } from "../test-setup"
import SMSService from "../../routers/SMS/SMSService"
import SMSController from "../../routers/SMS/SMSController"
import UserService from "../../routers/User/userService"
import { UserModel } from "../../models/User"
const databaseName = "test"

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})
const phoneData = {
  phone: "01020946440",
}
describe("SMS 서비스 테스트", () => {
  const smsController = new SMSController()
  smsController.smsService.sendSMS = jest.fn()
  const sendSMS = smsController.smsService.sendSMS

  test("sms 보내기", async () => {
    const req: any = {
      body: { phone: "01012345678" },
    }
    const res: any = {
      send: jest.fn(),
    }
    const next: any = jest.fn()
    await smsController.sendSMS(req, res, next)
    expect(sendSMS).toBeCalledTimes(1)
    //expect(r).toEqual({ result: "success" });
  })
})

afterAll(async () => {
  await dropAllCollections()
  await mongoose.connection.close()
})
