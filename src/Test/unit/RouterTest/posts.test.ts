import mongoose from "mongoose";
import { removeSelectCollections } from "../../test-setup";
import PostService from "../../../routers/Post/postService";
import { UserModel, User } from "../../../models/User";
import { PostModel, Post } from "../../../models/Post";
const databaseName = "test";

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
});

describe("포스트 서비스 테스트하기", () => {
  const postService = new PostService();
  //arrange
  let newPost: any;
  let userId: string;
  let user1: User | null;
  let user2: User | null;
  let user3: User | null;
  let mongoId_ex = mongoose.Types.ObjectId().toHexString();
  let postId: string;

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

  const postUpdateData: any = {
    title: "update test",
    content: "update test",
    personnel: 1,
    meeting: "online",
    status: false,
  };

  test("포스트 생성 시 필요한 유저 찾기", async () => {
    user1 = await UserModel.findOne({ name: "test1" });
    user2 = await UserModel.findOne({ name: "test2" });
    user3 = await UserModel.findOne({ name: "test3" });
  });

  test("포스트 생성시 성공", async () => {
    //arrange
    // act
    newPost = await postService.createPost(post, user1!._id);
    const findPost = await PostModel.findById(newPost._id);
    // assert
    expect(newPost._id).toEqual(findPost!._id);
  });

  test("포스트 생성 실패(유저 정보가 잘못된 경우)", async () => {
    //arrange
    //act
    //assert
    await expect(async () => {
      await postService.createPost(post, "1234");
    }).rejects.toThrow(
      'post validation failed: user: Cast to ObjectId failed for value "1234" at path "user"'
    );
  });

  test("포스트 생성 실패(위도 경도 중 하나만 있는 경우)", async () => {
    //arrange
    //act
    //assert
    await expect(async () => {
      await postService.createPost(post2, user1!._id);
    }).rejects.toThrow("위치 정보가 잘못되었습니다.");
  });

  test("특정 포스트 가지고오기 ", async () => {
    // act
    const post = await postService.getPostById(newPost._id);

    //assert
    expect(post!._id).toEqual(newPost._id);
    expect(post!.title).toStrictEqual("test");
    expect(typeof post!.title).toBe("string");
    expect(typeof post!.personnel).toBe("number");
  });

  test("포스트 업데이트 성공", async () => {
    // arrange
    // act
    postId = newPost._id.toHexString();
    newPost = await postService.updatePost(postUpdateData, user1!._id, postId);
    // assert
    expect(newPost!.title).toStrictEqual("update test");
  });

  test("포스트 업데이트 실패(postId가 잘못된 경우)", async () => {
    await expect(async () => {
      await postService.updatePost(postUpdateData, user1!._id, mongoId_ex);
    }).rejects.toThrow("작성하신 글이 존재하지 않습니다.");
  });

  test("스터디에 참가자 추가 성공", async () => {
    // arrange
    // act
    postId = newPost._id.toHexString();
    await postService.addParticipant(postId, user1!._id, user2!._id);
    const findPost = await PostModel.findById(postId);

    // assert
    expect(findPost!.participants).toContainEqual(user2!._id);
  });

  test("스터디에 참가자 추가 실패(participant가 잘못된 정보일 때)", async () => {
    //arrange
    //act
    //assert
    await expect(async () => {
      await postService.addParticipant(postId, user1!._id, mongoId_ex);
    }).rejects.toThrow("잘못된 참가자 정보입니다.");
  });

  test("스터디에 참가자 추가 실패(postId 또는 작성자id가 잘못된 경우)", async () => {
    //arrange
    //act
    //assert
    await expect(async () => {
      await postService.addParticipant(postId, mongoId_ex, user2!._id);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");

    await expect(async () => {
      await postService.addParticipant(mongoId_ex, user1!._id, user2!._id);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");
  });

  test("스터디에 참가자 추가 실패(본인을 참가자로 넣은 경우)", async () => {
    //arrange
    //act
    //assert
    await expect(async () => {
      await postService.addParticipant(
        postId,
        user1!._id.toHexString(),
        user1!._id
      );
    }).rejects.toThrow("본인은 참가자로 넣거나 뺄 수 없습니다.");
  });

  test("스터디에 참가자 추가 실패(참여인원을 경우)", async () => {
    //arrange
    //act
    //assert
    await expect(async () => {
      await postService.addParticipant(
        postId,
        user1!._id.toHexString(),
        user3!._id
      );
    }).rejects.toThrow("참여인원이 초과했습니다.");
  });

  test("스터디에 참가자 삭제 성공", async () => {
    // arrange
    // act
    await postService.deleteParticipant(postId, user1!._id, user2!._id);
    const findPost = await PostModel.findById(postId);

    // assert
    expect(findPost?.participants.length).toEqual(0);
  });

  test("스터디에 참가자 삭제 실패(participant가 잘못된 정보인 경우)", async () => {
    // arrange
    // act
    // assert
    await expect(async () => {
      await postService.deleteParticipant(postId, user1!._id, mongoId_ex);
    }).rejects.toThrow("잘못된 참가자 정보입니다.");
  });

  test("스터디에 참가자 삭제 실패(postId 또는 userId가 잘못된 경우)", async () => {
    // arrange
    // act
    // assert
    await expect(async () => {
      await postService.deleteParticipant(postId, mongoId_ex, user2!._id);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");
    await expect(async () => {
      await postService.deleteParticipant(mongoId_ex, user1!._id, user2!._id);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");
  });

  test("스터디에 참가자 삭제 실패(본인을 참가자에서 삭제하려는 경우)", async () => {
    // arrange
    // act
    // assert
    await expect(async () => {
      await postService.deleteParticipant(
        postId,
        user1!._id.toHexString(),
        user1!._id
      );
    }).rejects.toThrow("본인은 참가자로 넣거나 뺄 수 없습니다.");
  });

  test("스터디에 참가자 삭제 실패(참여인원에 해당 사용자가 없는 경우)", async () => {
    await expect(async () => {
      await postService.deleteParticipant(
        postId,
        user1!._id.toHexString(),
        user3!._id
      );
    }).rejects.toThrow("참여 인원에 해당 사용자의 정보가 없습니다.");
  });

  test("게시글 마감 성공", async () => {
    //arrange
    //act
    await postService.updatePostStatus(newPost._id, user1!._id);
    const changeStaustPost = await postService.getPostById(newPost._id);

    //assert
    expect(changeStaustPost!.status).toEqual(false);
  });

  test("게시글 마감 실패(postId 또는 userId가 잘못 되었을 때)", async () => {
    //arrange
    //act
    //assert
    await expect(async () => {
      await postService.updatePostStatus(newPost._id, mongoId_ex);
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.");
  });

  test("포스트 삭제하기", async () => {
    // arrange
    // act
    await postService.deletePost(user1!._id, postId);
    const post = await postService.getPostById(postId);

    // assert
    expect(post).toBeNull();
  });
});

afterAll(async () => {
  await removeSelectCollections("posts");
  await mongoose.connection.close();
});
