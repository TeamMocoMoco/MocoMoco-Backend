import * as schedule from "node-schedule";
import ScheduleService from "../routers/Post/scheduleService";

interface scheduleWork {
  hour?: number;
  minute?: number;
  dayOfWeek?: number;
}

const dayOfWork: scheduleWork = {
  hour: 22,
  minute: 15,
  dayOfWeek: 6,
};

const scheduleService = new ScheduleService();

// test용 scheduler
// const startTime = new Date(Date.now() + 5000);
// const endTime = new Date(startTime.getTime() + 5000);
// export const test = schedule.scheduleJob("10 * * * * *", () => {
//   console.log("test");
// });

//사용하는 scheduler
export const scheduleJob = schedule.scheduleJob("59 14 * * *", async () => {
  console.log("스케쥴링 시작");
  await scheduleService.changeStatus();
});
