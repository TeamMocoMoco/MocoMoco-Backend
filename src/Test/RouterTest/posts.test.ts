import mongoose from "mongoose";
import { dropAllCollections, removeAllCollections } from "../test-setup";
import PostService from "../../routers/Post/postService";
import UserService from "../../routers/User/userService";
import { UserModel } from "../../models/User";
import { PostModel } from "../../models/Post";
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

  test("포스트 생성", async () => {
    const post: any = {
      title: "test",
      content: "test",
      personnel: 5,
      meeting: "online",
      category: "모각코",
      status: true,
    };
    const newPost = await postService.createPost(post, "1");
    const findPost = await PostModel.findOne({
      user: "1",
    });
    expect(newPost._id).toEqual(findPost!._id);
  });
});

afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});
