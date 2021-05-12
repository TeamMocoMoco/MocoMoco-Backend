import * as schedule from "node-schedule";
import ScheduleService from "../routers/Post/scheduleService";

const scheduleService = new ScheduleService();

//사용하는 scheduler
export const scheduleJob = schedule.scheduleJob("59 14 * * *", async () => {
  console.log("스케쥴링 시작");
  await scheduleService.changeStatus();
});
