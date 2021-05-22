import request from "supertest";
import mongoose from "mongoose";
import { removeSelectCollections } from "../test-setup";
import App from "../../app";
import UserService from "../../routers/User/userService";
import { PostModel } from "../../models/Post";
import PostController from "../../routers/Post/postController";
import SMSController from "../../routers/SMS/SMSController";
import express from "express";

let app: express.Application;
let userToken: string;
let postId: string;
let mongoId_ex = mongoose.Types.ObjectId().toHexString();

beforeAll(async () => {
  app = new App([new PostController(), new SMSController()]).app;
});

describe("POST API Super Test", () => {
  const userService = new UserService();

  test("포스트 생성 ", async () => {
    //arrange
    const result = await userService.login("01012345678");
    console.log(111, process.env.TOKEN_KEY);
    userToken = result.token;
    //act
    const response = await request(app)
      .post("/posts")
      .set("token", userToken)
      .send({
        title: "test",
        category: "test",
        content: "test",
        personnel: 4,
        hashtag: ["test", "test"],
        location: [36.7, 38.7],
        meeting: "offline",
        startDate: "2023-05-26T14:00:00Z",
        dueDate: "2023-05-30T14:00:00Z",
      });
    //assert
    expect(response.status).toBe(200);
  });

  test("포스트 전체 가져오기 ", async () => {
    //arrange
    //act
    const response = await request(app).get("/posts").send({});
    //assert
    expect(response.status).toBe(200);
    expect(response.body.result.length).toEqual(1);
  });

  test("상세 포스트 가져오기 성공", async () => {
    //arrange
    const post = await PostModel.findOne({ title: "test" });
    postId = post!._id;
    //act
    const response = await request(app).get(`/posts/${postId}`);
    //assert
    expect(response.status).toBe(200);
    expect(response.body.result.title).toEqual("test");
  });

  test("상세 포스트 가져오기 실패(postId가 mongoId가 아닐 경우)", async () => {
    //arrange
    postId = "1234";
    //act
    const response = await request(app).get(`/posts/${postId}`);
    //assert
    expect(response.status).toBe(500);
    expect(response.body.err).toEqual("오브젝트 아이디가 아닙니다.");
  });

  test("상세 포스트 가져오기 실패(존재하지 않는 post의 id인 경우)", async () => {
    //arrange
    //act
    const response = await request(app).get(`/posts/${mongoId_ex}`);
    //assert
    expect(response.status).toBe(500);
    expect(response.body.err).toEqual("해당 게시물이 존재하지 않습니다.");
  });

  test("게시글 수정하기", async () => {
    //arrange
    //act
    //assert
  });
});

afterAll(async () => {
  await removeSelectCollections("posts");
  await mongoose.connection.close();
});
