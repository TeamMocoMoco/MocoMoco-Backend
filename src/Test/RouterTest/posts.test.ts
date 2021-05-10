import mongoose from "mongoose";
import { dropAllCollections, removeAllCollections } from "../test-setup";
import PostService from "../../routers/Post/postService";
const databaseName = "test";

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe("postService test", () => {
  const postService = new PostService();
  test("포스트 생성", async () => {});
});

afterAll(async () => {
  await mongoose.connection.close();
  await dropAllCollections();
});
