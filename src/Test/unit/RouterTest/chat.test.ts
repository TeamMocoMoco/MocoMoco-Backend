import mongoose from "mongoose";
import { removeSelectCollections } from "../../test-setup";
import { User, UserModel } from "../../../models/User";

import ChatService from "../../../routers/Chat/chatService";
import RoomService from "../../../routers/Chat/roomService";

import "dotenv/config";
const databaseName = "test";

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

describe("채팅관련 테스트", async () => {
  const user1 = await UserModel.findOne({ nmae: "kks" });
  const user2 = await UserModel.findOne({ nmae: "kky" });
  const chatService = new ChatService();
  const roomService = new RoomService();

  test("채팅방을 처음 만들었을 때 채팅 기록을 가지고 오면 안된다.", async () => {});

  test("채팅방을 지웠으면 채팅방을 가지고 오면 안된다.", async () => {});
});

afterAll(async () => {
  await removeSelectCollections("posts");
  await mongoose.connection.close();
});
