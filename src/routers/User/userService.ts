import { User, UserModel } from "../../models/User/"
import { Post, PostModel } from "../../models/Post/"
import jwt from "jsonwebtoken"

class UserService {
  private userModel = UserModel
  private postModel = PostModel
  constructor() { }

  createUser = async (userData: User, phoneData: string): Promise<User> => {
    const userByPhone = await this.userModel.findOne({ phone: phoneData });
    if (userByPhone) throw new Error("이미 존재하는 번호입니다")
    const createUser = new this.userModel({ ...userData, phone: phoneData });
    try {
      await createUser.save();
      return createUser
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  login = async (phoneData: string): Promise<string> => {
    try {
      const user = await this.userModel.findOne({ phone: phoneData });
      if (!user) throw new Error("없는 휴대폰 번호입니다")
      const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY as string)
      return token
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  updateUser = async (userUpdateData: Partial<User>, userId: string): Promise<User | null> => {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          ...userUpdateData,
        },
        { new: true }
      );
      return user
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  getMyPage = async (userId: string): Promise<{ user: User, userPost: Post[], userActivePost: Post[], participantsPost: Post[], participantsActivePost: Post[] }> => {
    try {
      const user = await this.userModel.findById(userId)
      if (!user) throw new Error("없는 유저입니다")
      // const posts = await this.postModel
      // .find({
      //   $or: [
      //     { user: user._id },
      //     { participants: user._id },
      //   ]
      // })
      // .sort("-createdAt")
      const userPost = await this.postModel.find([{ user: user._id }]).sort("-createdAt")
      const userActivePost = await this.postModel.find([{ user: user._id, status: true }]).sort("-createdAt")
      const participantsPost = await this.postModel.find([{ participants: user._id }]).sort("-createdAt")
      const participantsActivePost = await this.postModel.find([{ participants: user._id, status: true }]).sort("-createdAt")
      return { user, userPost, userActivePost, participantsPost, participantsActivePost }
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }
}

export default UserService