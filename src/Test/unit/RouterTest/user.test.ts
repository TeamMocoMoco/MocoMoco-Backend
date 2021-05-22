import mongoose from "mongoose";
import { removeSelectCollections } from "../../test-setup";
import UserService from "../../../routers/User/userService";
import PostService from "../../../routers/Post/postService";
import { User, UserModel } from "../../../models/User";
require('dotenv').config();

const databaseName = "test";

const user1: any = {
  name: "test1",
  role: "개발자",
};
const user1Phone: string = "01012345678"
const user2: any = {
  name: "test2",
  role: "개발자",
};
const user2Phone: string = "01056781234"
const user3: any = {
  name: "test3",
  role: "디자이너",
};
const user3Phone: string = "01011112222"
const user4: any = {
  name: "test4",
  role: "기획자"
}

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
});

describe("유저 서비스 테스트", () => {
  const userService = new UserService();
  const postService = new PostService();

  test("유저 생성", async () => {
    //act
    const newUser1 = await userService.createUser(user1, user1Phone);
    const newUser2 = await userService.createUser(user2, user2Phone);
    const newUser3 = await userService.createUser(user3, user3Phone);

    // assert
    expect(newUser1.phone).toEqual(user1Phone);
    expect(newUser1.name).toEqual(user1.name)
    expect(newUser1.role).toEqual(user1.role)
    expect(newUser2.phone).toEqual(user2Phone);
    expect(newUser3.phone).toEqual(user3Phone);
    expect(async () => {
      await userService.createUser(user4, user1Phone)
    }).rejects.toThrow("이미 존재하는 번호입니다")
  });

  test("로그인", async () => {
    //arrange
    const newUser1 = await UserModel.findOne({ phone: user1Phone })

    //act
    const result = await userService.login(user1Phone);

    //assert
    expect(result.token).toBeDefined
    expect(result.user._id).toStrictEqual(newUser1?._id)
    expect(async () => {
      await userService.login("01000000000")
    }).rejects.toThrow("없는 휴대폰 번호입니다")
  });

  test("유저 업데이트", async () => {
    //arrange
    const newUser1 = await UserModel.findOne({ phone: user1Phone })
    const userUpdateData: any = {
      name: "test1Updated",
      introduce: "수정된 소개입니다"
    }

    //act
    const updatedUser = await userService.updateUser(userUpdateData, newUser1?._id)

    //assert
    expect(updatedUser?.introduce).toStrictEqual("수정된 소개입니다")
    expect(updatedUser?._id).toStrictEqual(newUser1?._id)
  })

  test("진행중인 글있는지 확인", async () => {
    //arrange
    const newUser1 = await UserModel.findOne({ phone: user1Phone })
    const newUser2 = await UserModel.findOne({ phone: user2Phone })
    const newUser3 = await UserModel.findOne({ phone: user3Phone })

    const date = Date.now()
    const fiveMin = 5 * 60 * 1000
    const duration = 9 * 60 * 60 * 1000
    const post = {
      title: "test",
      content: "test",
      personnel: 5,
      meeting: "online",
      category: "모각코",
      dueDate: new Date,
      status: true,
    };
    post.dueDate.setTime(date + fiveMin + duration)
    await postService.createPost(post as any, newUser2?._id);
    post.status = false
    post.dueDate.setTime(date - fiveMin + duration)
    await postService.createPost(post as any, newUser3?._id);

    //act
    const checkResult1 = await userService.checkDelete(newUser1?._id)
    const checkResult2 = await userService.checkDelete(newUser2?._id)
    const checkResult3 = await userService.checkDelete(newUser3?._id)

    //assert
    expect(checkResult1).toBeTruthy()
    expect(checkResult2).toBeFalsy()
    expect(checkResult3).toBeTruthy()
  })

  test("유저 정보 가져오기", async () => {
    //arrange
    const newUser1 = await UserModel.findOne({ phone: user1Phone })

    //act
    const getUser = await userService.getUser(newUser1?._id)

    //assert
    expect(getUser).toStrictEqual(newUser1)
    expect(async () => {
      await userService.getUser("60a66f794605ee37f346f93c")
    }).rejects.toThrow("없는 유저입니다")
    expect(async () => {
      await userService.getUser("")
    }).rejects
  })

  test("유저가 작성한 글 가져오기", async () => {
    //arrange
    const newUser1 = await UserModel.findOne({ phone: user1Phone })
    const newUser2 = await UserModel.findOne({ phone: user2Phone })
    const newUser3 = await UserModel.findOne({ phone: user3Phone })

    //act
    const posts1_t = await userService.getUserPost(1, newUser1?._id, true)
    const posts1_f = await userService.getUserPost(1, newUser1?._id, false)
    const posts2 = await userService.getUserPost(1, newUser2?._id, true) as any
    const posts3 = await userService.getUserPost(1, newUser3?._id, false)

    //assert
    expect(posts1_t).toHaveLength(0)
    expect(posts1_f).toHaveLength(0)
    expect(posts2).toHaveLength(1)
    expect(posts2[0].user._id).toStrictEqual(newUser2?._id)
    expect(posts3).toHaveLength(1)
    expect(async () => {
      await userService.getUserPost(1, "", false)
    }).rejects
    expect(async () => {
      await userService.getUserPost(1, "60a66f794605ee37f346f93c", false)
    }).rejects
  })

  test("유저가 참여한 글 가져오기", async () => {
    //arrange
    const newUser1 = await UserModel.findOne({ phone: user1Phone })
    const newUser2 = await UserModel.findOne({ phone: user2Phone })
    const posts2 = await userService.getUserPost(1, newUser2?._id, true)

    await postService.addParticipant(posts2[0]._id, newUser2?._id, newUser1?._id)

    //act
    const posts = await userService.getParticipantsPost(1, newUser1?._id, true)

    //assert
    expect(posts).toHaveLength(1)
  })
});

afterAll(async () => {
  await removeSelectCollections("users");
  await removeSelectCollections("posts");
  await mongoose.connection.close();
});
