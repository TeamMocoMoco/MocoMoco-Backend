import * as schedule from "node-schedule"
import PostService from "../routers/Post/postService"

interface scheduleWork{
    hour?:number
    minute?:number
    dayOfWeek?:number
}

const dayOfWork:scheduleWork = {
    hour:23,
    minute:59,
    dayOfWeek:6
}

// test용 scheduler
const startTime = new Date(Date.now()+5000);
const endTime = new Date(startTime.getTime()+5000);
export const test = schedule.scheduleJob('10 * * * * *', () => {
    console.log("test")
})


//사용하는 scheduler
export const job = schedule.scheduleJob(dayOfWork,async()=>{

})
