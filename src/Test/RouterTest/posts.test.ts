import mongoose from "mongoose"
import { dropAllCollections, removeAllCollections } from "../test-setup"
import PostService from "../../routers/Post/postService"
import { UserModel } from "../../models/User"
import { PostModel } from "../../models/Post"
const databaseName = "test"

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

describe("포스트 서비스 테스트하기", () => {
  const postService = new PostService()
  let newPost: any
  let userId: any

  test("포스트 생성", async () => {
    // arrange
    const post: any = {
      title: "test",
      content: "test",
      personnel: 5,
      meeting: "online",
      category: "모각코",
      status: true,
    }
    const u1 = {
      name: "kkk",
      phone: "k",
      role: "개발자",
    }
    const user1 = await UserModel.create(u1)
    userId = user1._id

    // act
    newPost = await postService.createPost(post, userId)
    const findPost = await PostModel.findById(newPost._id)
    // assert
    expect(newPost._id).toEqual(findPost!._id)
  })

  test("포스트 가지고오기 ", async () => {
    // act
    const post = await postService.getPostById(newPost._id)

    //assert
    expect(post!._id).toEqual(newPost._id)
    expect(post!.title).toStrictEqual("test")
    expect(typeof post!.title).toBe("string")
    expect(typeof post!.personnel).toBe("number")
  })

  test("포스트 업데이트 하기", async () => {
    // arrange
    const postUpdateData: any = {
      title: "update test",
      content: "update test",
      personnel: 4,
      meeting: "offline",
      category: "프로젝트",
      status: false,
    }
    // act
    const postId = newPost._id.toHexString()
    newPost = await postService.updatePost(postUpdateData, userId, postId)
    // assert
    expect(newPost!.title).toStrictEqual("update test")
  })

  test("스터디에 추가하기", async () => {
    // arrange

    const u2 = {
      name: "hhh",
      phone: "h",
      role: "기획자",
    }

    const u3 = {
      name: "zzz",
      phone: "z",
      role: "디자이너",
    }

    const user2 = await UserModel.create(u2)
    const user3 = await UserModel.create(u3)
    const newID = mongoose.Types.ObjectId().toHexString()
    // act
    const postId = newPost._id.toHexString()
    await postService.addParticipant(postId, userId, user2._id)
    const findPost = await PostModel.findById(postId)

    // assert
    expect(findPost!.participants).toContainEqual(user2._id)

    // participant가 잘못된 정보일 때
    expect(async () => {
      await postService.addParticipant(postId, userId, newID)
    }).rejects.toThrow("잘못된 참가자 정보입니다.")

    // postId 또는 userId가 잘못 되었을 때
    expect(async () => {
      await postService.addParticipant(postId, newID, user2._id)
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.")
    expect(async () => {
      await postService.addParticipant(newID, userId, user2._id)
    }).rejects.toThrow("잘못된 정보가 기재되었습니다.")

    expect(async () => {
      await postService.addParticipant(postId, userId.toHexString(), userId)
    }).rejects.toThrow("본인은 참가자로 넣거나 뺄 수 없습니다.")
  })

  test("포스트 삭제하기", async () => {
    // arrange

    // act
    const postId = newPost._id.toHexString()
    await postService.deletePost(userId, postId)
    const post = await postService.getPostById(postId)
    // assert
    expect(post).toBeNull()
  })
})

afterAll(async () => {
  await dropAllCollections()
  await mongoose.connection.close()
})
