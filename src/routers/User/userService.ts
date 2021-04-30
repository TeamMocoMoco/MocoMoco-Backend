import { User, UserModel } from "../../models/User/"
import jwt from "jsonwebtoken"

class UserService {
  private userModel = UserModel
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
}

export default UserService