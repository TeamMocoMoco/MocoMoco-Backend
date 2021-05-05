import mongoose from "mongoose";
import { dropAllCollections, removeAllCollections } from "../test-setup";
import PostService from "../../routers/Post/postService";
import { PostModel, PostDto, Post } from "../../models/Post";
import { UserModel, UserDTO, User } from "../../models/User";
const databaseName = "test";

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

describe("post test", () => {
  const postService = new PostService();
  test("post create test", () => {});
});

afterEach(async () => {
  await removeAllCollections();
});

afterAll(async () => {
  await mongoose.connection.close();
  await dropAllCollections();
});
