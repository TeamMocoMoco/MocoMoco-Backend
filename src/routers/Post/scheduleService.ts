import { PostModel } from "../../models/Post";

export default class ScheduleService {
  private post;

  constructor() {
    this.post = PostModel;
  }
  changeStatus = async (): Promise<void> => {
    const date = Date.now();
    const real_date = new Date(date);
    real_date.setDate(real_date.getHours() + 9);
    console.log(new Date(date));
    await this.post.updateMany(
      { startDate: { $lte: real_date } },
      { $set: { status: false } }
    );
  };
}
