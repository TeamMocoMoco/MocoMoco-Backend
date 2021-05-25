import request from "supertest";
import mongoose from "mongoose";
import App from "../../app";
import PostController from "../../routers/Post/postController";
import SMSController from "../../routers/SMS/SMSController";
import ChatController from "../../routers/Chat/chatController";
import UserService from "../../routers/User/userService";

const databaseName = "test";
const app = new App([
  new PostController(),
  new SMSController(),
  new ChatController(),
]).app;

describe("Chat API Super Test", () => {
  const userService = new UserService();
  describe("[GET]/rooms/myroom (채팅방 가지고오기 테스트)", () => {
    test("채팅방이 없으면 채팅방을 가지고오지 않는다.", async () => {
      console.log(process.env.TOKEN_KEY);
      const user1 = await userService.login("01012345678");
      const response = await request(app)
        .get("/rooms/myroom")
        .set("token", user1.token)
        .send({});
      expect(response.status).toBe(200);
      // expect(response.body.result.length).toEqual(0);
    });
  });

  // describe("[GET]/rooms/:roomId (해당 채팅방 가지고 오기 테스트) ", () => {});

  // describe("[POST]/rooms/:roomId (해당 채팅방 채팅방 만들기) ", () => {});

  // describe("[POST]/rooms/:roomId/chat (해당 채팅방 채팅 만들기) ", () => {});

  // describe("[delete]/rooms/:roomId (해당 채팅방 채팅방 삭제하기) ", () => {});
});

afterAll(async () => {
  // await dropAllCollections()
  await mongoose.connection.close();
});
