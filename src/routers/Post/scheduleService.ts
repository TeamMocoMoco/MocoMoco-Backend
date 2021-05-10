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
<<<<<<< HEAD
    console.log(new Date(date));
=======
>>>>>>> a0e7498574711853c28a4070c813bc840a94cb95
    await this.post.updateMany(
      { startDate: { $lte: real_date } },
      { $set: { status: false } }
    );
  };
}
