"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker = __importStar(require("faker"));
const User_1 = require("../models/User");
const Post_1 = require("../models/Post");
const utile_1 = require("../middlewares/utile");
async function generateFakeData(userCount, PostsPerUser) {
    if (typeof userCount !== "number" || userCount < 1)
        throw new Error("userCount must be a positive integer");
    if (typeof PostsPerUser !== "number" || PostsPerUser < 1)
        throw new Error("blogsPerUser must be a positive integer");
    const users = [];
    const posts = [];
    const chats = [];
    const roles = ["개발자", "디자이너", "기획자"];
    const categorys = ["모각코", "개발스터디", "알고리즘스터디", "면접스터디", "개념스터디", "프로젝트"];
    const onoffline = ['온라인', "오프라인"];
    const language = ["파이썬", "자바", "루비", "고", "자바스크립트", "타입스크립트", "노드", "C", "C++"];
    console.log("Preparing fake data.");
    for (let i = 0; i < userCount; i++) {
        users.push(new User_1.UserModel({
            name: faker.name.firstName(),
            phone: faker.phone.phoneNumber(),
            role: roles[utile_1.rand(0, roles.length)]
        }));
    }
    const startDate = new Date();
    const duedate = new Date();
    duedate.setDate(duedate.getDate() + 2);
    users.map(async (user) => {
        for (let i = 0; i < PostsPerUser; i++) {
            posts.push(new Post_1.PostModel({
                user: user._id,
                position: faker.company.companyName(),
                language: language[utile_1.rand(0, language.length)],
                title: language[utile_1.rand(0, language.length)],
                content: language[utile_1.rand(0, language.length)],
                personnel: utile_1.rand(0, 5),
                meeting: onoffline[utile_1.rand(0, onoffline.length)],
                category: categorys[utile_1.rand(0, categorys.length)],
                hashtag: [faker.lorem.word()],
                startDate: startDate,
                dueDate: duedate,
                status: true
            }));
        }
    });
    console.log("fake data inserting to database...");
    await User_1.UserModel.insertMany(users);
    console.log(`${users.length} fake users generated!`);
    await Post_1.PostModel.insertMany(posts);
    console.log(`${posts.length} fake blogs generated!`);
}
exports.default = generateFakeData;
;
