"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const test_setup_1 = require("../test-setup");
const postService_1 = __importDefault(require("../../routers/Post/postService"));
const databaseName = "test";
beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`;
    await mongoose_1.default.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});
describe("postService test", () => {
    const postService = new postService_1.default();
    test("포스트 생성", () => { });
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
    await test_setup_1.dropAllCollections();
});
