import * as faker from "faker"
import {UserModel,User} from "../models/User"
import {PostModel,Post} from "../models/Post"
import {ChatModel,Chat} from "../models/Chat"
import {rand} from "../middlewares/utile"


export default async function generateFakeData(userCount:number, PostsPerUser:number){
  if (typeof userCount !== "number" || userCount < 1)
    throw new Error("userCount must be a positive integer");
  if (typeof PostsPerUser !== "number" || PostsPerUser < 1)
    throw new Error("blogsPerUser must be a positive integer");

  const users:User[] = [];
  const posts:Post[] = [];
  const chats:Chat[] = [];
  const roles:string[] = ["개발자","디자이너","기획자"]
  const categorys:string[] = ["모각코","개발스터디","알고리즘스터디","면접스터디","개념스터디","프로젝트"]
  const onoffline:string[] = ['온라인',"오프라인"]
  const language:string[] = ["파이썬","자바","루비","고","자바스크립트","타입스크립트","노드","C","C++"]

  console.log("Preparing fake data.");

  for (let i = 0; i < userCount; i++) {
    users.push(
      new UserModel({
        name: faker.name.firstName(),
        phone:faker.phone.phoneNumber(),
        role: roles[rand(0,roles.length)]
      } 
    ));
  }

  const startDate = new Date()
  const duedate = new Date();
  duedate.setDate(duedate.getDate() + 2);

  users.map(async (user) => {
    for (let i = 0; i < PostsPerUser; i++) {
        posts.push(
        new PostModel({
            user:user._id,
            position:faker.company.companyName(),
            language:language[rand(0,language.length)],
            title: language[rand(0,language.length)],
            content: language[rand(0,language.length)],
            personnel: rand(0,5),
            meeting: onoffline[rand(0,onoffline.length)],
            category: categorys[rand(0,categorys.length)],
            hashtag: [faker.lorem.word()],
            startDate: startDate,
            dueDate: duedate,
            status:true
        })
    );
    }
  });
  
  console.log("fake data inserting to database...");
  await UserModel.insertMany(users);
  console.log(`${users.length} fake users generated!`);
  await PostModel.insertMany(posts);
  console.log(`${posts.length} fake blogs generated!`);
};
