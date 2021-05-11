import mongoose from "mongoose";
import { dropAllCollections, removeAllCollections } from "../test-setup";
import SMSService from "../../routers/SMS/smsService";
import SMSController from "../../routers/SMS/smsController";
import UserService from "../../routers/User/userService";
import { UserModel } from "../../models/User";
const databaseName = "test";

const smsService = new SMSService();
smsService.sendSMS = jest.fn();

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

const SMSData = {
  phone: "01012345678",
};

describe("sms controller test", () => {
  const smsController = new SMSController();
  test("send sms test", async () => {
    const req: any = {};
    const res: any = {};
    const next: any = jest.fn();
    const r = await smsController.sendSMS(req, res, next);
    expect(smsService.sendSMS).toBeCalledTimes(1);
    expect(r).toEqual({ result: "success" });
  });
});

afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});
