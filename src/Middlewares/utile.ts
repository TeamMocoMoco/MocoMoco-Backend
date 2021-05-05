import moment from "moment-timezone";

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return Date.UTC(year, month, today, hours, minutes, seconds, milliseconds);
}

export const dateKorean = moment.tz.zone("Asia/Seoul");
