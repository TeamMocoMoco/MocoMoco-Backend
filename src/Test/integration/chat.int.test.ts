import request from "supertest";
import mongoose from "mongoose";
import App from "../../app";
import PostController from "../../routers/Post/postController";
import SMSController from "../../routers/SMS/SMSController";
import ChatController from "../../routers/Chat/chatController";
import UserService from "../../routers/User/userService";
import { PostModel } from "../../models/Post";

const databaseName = "test";
const app = new App([new PostController(), new SMSController(), new ChatController()]).app;
process.env.TOKEN_KEY = "aaa";

describe("Chat API Super Test", () => {
  const userService = new UserService();

  describe("[POST] /rooms (채팅방 만들기)", () => {
    let admin: any;
    let adminPost: any;
    let participant: any;

    test("채팅방 만들기 위한 기본 설정", async () => {
      admin = await userService.login("01012345678");
      adminPost = await PostModel.findOne({ user: admin.user._id });
      participant = await userService.login("01056781234");
    });

    test("내가 쓴 글에는 채팅방이 만들어 지지 않는다.", async () => {
      const response = await request(app).post("/rooms").set("token", admin.token).send({
        admin: admin.user._id,
        post: adminPost?._id,
      });
      expect(response.status).toBe(500);
    });
    test("채팅방에 다른 키가 들어가면 생성이 된다. (DTO가 걸러주기 때문에 ) ", async () => {
      const response = await request(app).post("/rooms").set("token", participant.token).send({
        admin: admin.user._id,
        post: adminPost?._id,
        unknown: "unknown",
      });
      expect(response.status).toBe(200);
    });
  });

  describe("[GET]/rooms/myroom (채팅방 가지고오기 테스트)", () => {
    test("채팅방이 없으면 채팅방을 가지고오지 않는다.", async () => {
      const user1 = await userService.login("01012345678");
      const response = await request(app).get("/rooms/myroom").set("token", user1.token).send({});
      expect(response.status).toBe(200);
      expect(response.body.result.rooms.length).toEqual(0);
    });
  });

  //describe("[GET]/rooms/:roomId (해당 채팅방 가지고 오기 테스트) ", () => {});

  // describe("[POST]/rooms/:roomId (해당 채팅방 채팅방 만들기) ", () => {});

  // describe("[POST]/rooms/:roomId/chat (해당 채팅방 채팅 만들기) ", () => {});

  // describe("[delete]/rooms/:roomId (해당 채팅방 채팅방 삭제하기) ", () => {});
});

afterAll(async () => {
  // await dropAllCollections()
  await mongoose.connection.close();
});
