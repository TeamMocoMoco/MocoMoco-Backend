import mongoose from "mongoose";
import { removeSelectCollections } from "../../test-setup";
import { UserModel, User } from "../../../models/User";
import { PostModel, Post } from "../../../models/Post";

import ChatService from "../../../routers/Chat/chatService";
import RoomService from "../../../routers/Chat/roomService";
import PostService from "../../../routers/Post/postService";

import "dotenv/config";
import { CodeStarconnections } from "aws-sdk";

const databaseName = "test";

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

describe("채팅관련 테스트", () => {
  // arrange
  let user1: User | null;
  let user2: User | null;
  let post1: Post | null;
  let roomId: string;

  const post: any = {
    title: "test",
    content: "test",
    personnel: 5,
    meeting: "online",
    category: "모각코",
    status: true,
  };

  const postService = new PostService();
  const chatService = new ChatService();
  const roomService = new RoomService();

  test("채팅방 초기 설정 포스트 생성 및 유저 찾기", async () => {
    user1 = await UserModel.findOne({ name: "test1" });
    user2 = await UserModel.findOne({ name: "test2" });
    await postService.createPost(post, user1?._id);
    post1 = await PostModel.findOne({ title: "test" });
  });

  test("채팅방을 처음 만들었을 때 채팅방을 가지고 오면 안된다.(채팅기록이 없긴 때문에)", async () => {
    //arrange
    // user1 = amdin   user2 = participant
    const room: any = {
      admin: user1?._id,
      post: post1?._id,
      participant: user2?._id,
    };

    // act
    roomId = await roomService.createRoom(room, user2?._id);
    const adminRooms = await roomService.getRooms(user1?._id);
    const participantRooms = await roomService.getRooms(user2?._id);
    const Room = await roomService.getRoomById(roomId);

    // assert
    expect(adminRooms.length).toEqual(0);
    expect(participantRooms.length).toEqual(0);
    expect(Room).toBeTruthy();
  });

  test("채팅을 하나라도 쓰면 채팅방을 가지고 온다.", async () => {
    // arrange
    const chat: any = {
      content: "hello",
    };

    //act
    await chatService.creatChat(chat, user1?._id, roomId);
    const adminRooms = await roomService.getRooms(user1?._id);
    const participantRooms = await roomService.getRooms(user2?._id);

    //assert
    expect(adminRooms.length).toEqual(1);
    expect(participantRooms.length).toEqual(1);
  });

  test("채팅방을 지웠으면 채팅방을 가지고 오면 안된다. 하지만 상대방은 채팅방이 있어야함", async () => {
    //act
    await roomService.deleteRoomById(roomId, user1?._id);
    const adminRooms = await roomService.getRooms(user1?._id);
    const participantRooms = await roomService.getRooms(user2?._id);

    // assert
    expect(adminRooms.length).toEqual(0);
    expect(participantRooms.length).toEqual(1);
  });
});

afterAll(async () => {
  await removeSelectCollections("posts");
  await removeSelectCollections("chats");
  await removeSelectCollections("rooms");
  await mongoose.connection.close();
});
