import "reflect-metadata";

const plan = {
  color: "red",
};

Reflect.defineMetadata("note", "hi there", plan);
Reflect.defineMetadata("height", "hey", plan);
Reflect.defineMetadata("color", "aaa", plan, "color");

console.log(plan); // 정의한 메타데이터는 보이지 않는다.

const note = Reflect.getMetadata("note", plan);
// console.log(note);
const height = Reflect.getMetadata("height", plan);
// console.log(height);
const color = Reflect.getMetadata("color", plan, "color");
console.log(note, height, color);
