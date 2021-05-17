import { PostModel } from "../../models/Post"

export default class ScheduleService {
  private postModel

  constructor() {
    this.postModel = PostModel
  }
  changeStatus = async (): Promise<void> => {
    const real_date = new Date(Date.now())
    await this.postModel.updateMany({ startDate: { $lte: real_date } }, { $set: { status: false } })
  }
}
