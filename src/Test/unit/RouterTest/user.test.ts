import mongoose from "mongoose";
import { removeSelectCollections } from "../../test-setup";
import UserService from "../../../routers/User/userService";
import { User } from "../../../models/User";
import "dotenv/config";
const databaseName = "test";

const user1: any = {
  name: "test1",
  phone: "01012345678",
  role: "개발자",
};

const user2: any = {
  name: "test2",
  phone: "01056781234",
  role: "개발자",
};

const user3: any = {
  name: "test3",
  phone: "01011112222",
  role: "디자이너",
};

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

describe("유저 생성 및 유저 로그인 기능 테스트 하기", () => {
  const userService = new UserService();

  test("유저 생성", async () => {
    //act
    const newUser = await userService.createUser(user1, user1.phone);
    const newUser2 = await userService.createUser(user2, user2.phone);
    const newUser3 = await userService.createUser(user3, user3.phone);
    // assert
    expect(newUser.phone).toEqual(user1.phone);
  });

  test("로그인", async () => {
    //act
    const result = await userService.login(user1.phone);
    const meToken: string = result.token;
    const meUser: User = result.user;

    //assert
    expect(user1.phone).toEqual(meUser.phone);
    expect(user1.phone).not.toEqual(user2.phone);
    expect(async () => {
      await userService.login("000");
    }).rejects.toThrow("없는 휴대폰 번호입니다");
  });
});

afterAll(async () => {
  await removeSelectCollections("users");
  await mongoose.connection.close();
});
