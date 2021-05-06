import { PostModel } from "../../models/Post";

export default class ScheduleService {
  private post;

  constructor() {
    this.post = PostModel;
  }
  changeStatus = async (): Promise<void> => {
    const date = Date.now();
    const real_date = new Date(date);
    real_date.setHours(real_date.getHours() + 9);
    await this.post.updateMany(
      { startDate: { $lte: real_date } },
      { $set: { status: false } }
    );
  };
}
