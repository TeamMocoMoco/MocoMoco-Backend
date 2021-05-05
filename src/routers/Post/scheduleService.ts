import {PostModel} from '../../models/Post'

export default class ScheduleService{

    private post;

    constructor(){
        this.post = PostModel
    }
    changeStatus = async (): Promise<void> => {
        const date = Date.now();
        console.log(new Date(date));
        await this.post.updateMany(
        { startDate: { $lte: new Date(date) } },
        { $set: { status: false } }
        );
    };
}
