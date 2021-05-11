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

  checkDelete = async (userId: string): Promise<Boolean> => {
    const post = await this.postModel.find({ user: userId }).sort("-dueDate")

    const duration = 9 * 60 * 60 * 1000
    const timeDiff = post[0].dueDate.getTime() - duration - Date.now()
    if (timeDiff > 0) {
      // 아직 dueDate가 지나지 않은 post가 있기 때문에 삭제가 되면 안됨
      return false
    }
    return true
  }

  getUser = async (userId: string): Promise<User> => {
    const user = await this.userModel.findById(userId)
    if (!user) throw new Error("없는 유저입니다")
    return user
  }
  getUserPost = async (userId: string, active: boolean = true): Promise<Post[]> => {
    const userActivePost = await this.postModel
      .find({ $and: [{ user: userId }, { status: active }] })
      .sort("-createdAt")
    return userActivePost
  }

  getParticipantsPost = async (userId: string, active: boolean = true): Promise<Post[]> => {
    const participantsPost = await this.postModel
      .find({ $and: [{ participants: userId }, { status: active }] })
      .sort("-createdAt")
    return participantsPost
  }
}
