import mongoose from "mongoose";
import { removeSelectCollections } from "../../test-setup";
import PostService from "../../../routers/Post/postService";
import { UserModel } from "../../../models/User";
import { PostModel } from "../../../models/Post";
const databaseName = "test";

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe("포스트 서비스 테스트하기", () => {
  const postService = new PostService();
  let newPost: any;
  let userId: any;

  test("포스트 생성", async () => {
    // arrange
    const post: any = {
      title: "test",
      content: "test",
      personnel: 5,
      meeting: "offline",
      category: "모각코",
      status: true,
      location: [],
      hashtag: [],
      startDate: "2022-05-24T15:59:00Z",
      dueDate: "2022-06-27T14:00:00Z",
    };

    const post2: any = {
      title: "test2",
      content: "test",
      personnel: 5,
      meeting: "offline",
      category: "모각코",
      status: true,
      location: [12],
      hashtag: [],
      startDate: "2022-05-24T15:59:00Z",
      dueDate: "2022-06-27T14:00:00Z",
    };

    const user1 = await UserModel.findOne({ name: "test1" });
    userId = user1!._id;

    // act
    newPost = await postService.createPost(post, userId);
    const findPost = await PostModel.findById(newPost._id);
    // assert
    //올바르게 생성된 경우
    expect(newPost._id).toEqual(findPost!._id);
    //유저 정보가 잘못된 경우(mongoId가 잘못된 경우)
    await expect(async () => {
      await postService.createPost(post, "1234");
    }).rejects.toThrow(
      'post validation failed: user: Cast to ObjectId failed for value "1234" at path "user"'
    );
    //위치 정보가 잘못된 경우(위도 경도 중 하나만 있는 경우)
    await expect(async () => {
      await postService.createPost(post2, userId);
    }).rejects.toThrow("위치 정보가 잘못되었습니다.");
  });

  test("포스트 가지고오기 ", async () => {
    // act
    const post = await postService.getPostById(newPost._id);

    //assert
    expect(post!._id).toEqual(newPost._id);
    expect(post!.title).toStrictEqual("test");
    expect(typeof post!.title).toBe("string");
    expect(typeof post!.personnel).toBe("number");
  });

  test("포스트 업데이트 하기", async () => {
    // arrange
    const postUpdateData: any = {
      title: "update test",
      content: "update test",
      personnel: 1,
      meeting: "online",
      status: false,
    };
    // act
    const postId = newPost._id.toHexString();
    const testId = mongoose.Types.ObjectId().toHexString();
    newPost = await postService.updatePost(postUpdateData, userId, postId);
    // assert
    //제대로 업데이트가 된 경우
    expect(newPost!.title).toStrictEqual("update test");
    //postId가 잘못된 경우(업데이트 실패시)
    await expect(async () => {
      await postService.updatePost(postUpdateData, userId, testId);
    }).rejects.toThrow("작성하신 글이 존재하지 않습니다.");
  });

  // test("포스트 가져오기", async () => {
  //   //arrange
  //   const post3: any = {
  //     title: "test3",
  //     content: "test",
  //     personnel: 5,
  //     meeting: "online",
  //     category: "모각코",
  //     status: true,
  //     location: [],
  //     hashtag: [],
  //     startDate: "2022-05-24T15:59:00Z",
  //     dueDate: "2022-06-27T14:00:00Z",
  //   };
  //   await postService.createPost(post3, userId);
  //   //act
  //   const allPosts = await postService.getPosts(1, "online", "모각코", "test");
  //   console.log(allPosts);
  //   //assert
  //   expect(allPosts.length).toEqual(2);
  // });
  test("스터디에 참가자 추가하기", async () => {
    // arrange
    const user2 = await UserModel.findOne({ name: "test2" });
    const user3 = await UserModel.findOne({ name: "test3" });
    const newID = mongoose.Types.ObjectId().toHexString();

    if (!user2) return;

    // act
    const postId = newPost._id.toHexString();
    await postService.addParticipant(postId, userId, user2._id);
    const findPost = await PostModel.findById(postId);

    // assert
    expect(findPost!.participants).toContainEqual(user2._id);

    // participant가 잘못된 정보일 때
    await expect(async () => {
      await postService.addParticipant(postId, userId, newID);
    }).rejects.toThrow("잘못된 참가자 정보입니다.");

    // postId 또는 userId가 잘못 되었을 때
    await expect(async () => {
      await postService.addParticipant(postId, newID, user2._id);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");
    await expect(async () => {
      await postService.addParticipant(newID, userId, user2._id);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");

    //본인을 참가자로 넣은 경우
    await expect(async () => {
      await postService.addParticipant(postId, userId.toHexString(), userId);
    }).rejects.toThrow("본인은 참가자로 넣거나 뺄 수 없습니다.");

    //참여인원을 초과한 경우
    await expect(async () => {
      await postService.addParticipant(
        postId,
        userId.toHexString(),
        user3!._id
      );
    }).rejects.toThrow("참여인원이 초과했습니다.");
  });

  test("스터디에 참가자 삭제하기", async () => {
    // arrange
    const user2 = await UserModel.findOne({ name: "test2" });
    const user3 = await UserModel.findOne({ name: "test3" });
    const newID = mongoose.Types.ObjectId().toHexString();

    if (!user2) return;

    // act
    const postId = newPost._id.toHexString();
    await postService.deleteParticipant(postId, userId, user2._id);
    const findPost = await PostModel.findById(postId);

    // assert
    //올바르게 삭제된 경우
    expect(findPost?.participants.length).toEqual(0);
    // participant가 잘못된 정보일 때
    await expect(async () => {
      await postService.deleteParticipant(postId, userId, newID);
    }).rejects.toThrow("잘못된 참가자 정보입니다.");

    // postId 또는 userId가 잘못 되었을 때
    await expect(async () => {
      await postService.deleteParticipant(postId, newID, user2._id);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");
    await expect(async () => {
      await postService.deleteParticipant(newID, userId, user2._id);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");

    //본인을 참가자에서 삭제하는 경우
    await expect(async () => {
      await postService.deleteParticipant(postId, userId.toHexString(), userId);
    }).rejects.toThrow("본인은 참가자로 넣거나 뺄 수 없습니다.");

    //참여인원에 해당 사용자가 없는 경우
    await expect(async () => {
      await postService.deleteParticipant(
        postId,
        userId.toHexString(),
        user3!._id
      );
    }).rejects.toThrow("참여 인원에 해당 사용자의 정보가 없습니다.");
  });

  test("게시글 마감하기", async () => {
    //arrange
    //act
    await postService.updatePostStatus(newPost._id, userId);
    const changeStaustPost = await postService.getPostById(newPost._id);
    const newID = mongoose.Types.ObjectId().toHexString();

    //assert
    //정상적인 게시글 마감
    expect(changeStaustPost!.status).toEqual(false);

    //postId 또는 userId가 잘못 되었을 때
    await expect(async () => {
      await postService.updatePostStatus(newPost._id, newID);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");
  });

  test("포스트 삭제하기", async () => {
    // arrange

    // act
    const postId = newPost._id.toHexString();
    await postService.deletePost(userId, postId);
    const post = await postService.getPostById(postId);
    // assert
    expect(post).toBeNull();
  });
});

afterAll(async () => {
  await removeSelectCollections("posts");
  await mongoose.connection.close();
});
