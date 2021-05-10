import { User, UserModel } from "../../models/User/"
import { Post, PostModel } from "../../models/Post/"
import jwt from "jsonwebtoken"

export default class UserService {
  private userModel = UserModel
  private postModel = PostModel
  constructor() {}

  createUser = async (userData: User, phoneData: string): Promise<User> => {
    const userByPhone = await this.userModel.findOne({ phone: phoneData })
    if (userByPhone) throw new Error("이미 존재하는 번호입니다")

    const createUser = new this.userModel({ ...userData, phone: phoneData })
    await createUser.save()
    return createUser
  }

  login = async (phoneData: string): Promise<{ token: string; user: User }> => {
    const user = await this.userModel.findOne({ phone: phoneData })
    if (!user) throw new Error("없는 휴대폰 번호입니다")

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY as string)
    return { token, user }
  }

  updateUser = async (userUpdateData: Partial<User>, userId: string): Promise<User | null> => {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { ...userUpdateData },
      { new: true }
    )

    return user
  }

  getUser = async (userId: string): Promise<User> => {
    const user = await this.userModel.findById(userId)
    if (!user) throw new Error("없는 유저입니다")
    return user
  }

  getUserDeactivePost = async (userId: string): Promise<Post[]> => {
    const userDeactivePost = await this.postModel
      .find({ $and: [{ user: userId }, { status: false }] })
      .sort("-createdAt")
    return userDeactivePost
  }

  getUserActivePost = async (userId: string): Promise<Post[]> => {
    const userActivePost = await this.postModel
      .find({ $and: [{ user: userId }, { status: true }] })
      .sort("-createdAt")
    return userActivePost
  }

  getParticipantsDeactivePost = async (userId: string): Promise<Post[]> => {
    const participantsPost = await this.postModel
      .find({ $and: [{ participants: userId }, { status: false }] })
      .sort("-createdAt")
    return participantsPost
  }

  getParticipantsActivePost = async (userId: string): Promise<Post[]> => {
    const participantsActivePost = await this.postModel
      .find({ $and: [{ participants: userId }, { status: true }] })
      .sort("-createdAt")
    return participantsActivePost
  }
}
