import "dotenv/config";
import App from "./app";
import UserController from "./routers/User/userController";
import PostController from "./routers/Post/postController";
import SMSController from "./routers/SMS/smsController";
import ChatController from "./routers/Chat/chatController";
import * as http from "http";
import ChatServer from "./socket";
import generateFakeData from "./Test/generateData";

const port = process.env.PORT || 5000;

const app = new App([
  new UserController(),
  new PostController(),
  new SMSController(),
  new ChatController(),
]).app;

const server = http.createServer(app);
const chatServer = new ChatServer(server, app);

server.listen(port, async function () {
  // generateFakeData(5, 5)
  console.log("Server Start~!");
});
