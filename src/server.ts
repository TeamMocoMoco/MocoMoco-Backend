import "dotenv/config";
import App from "./app";
import UserController from "./routers/User/userController";
import PostController from "./routers/Post/postController";
import SMSController from "./routers/SMS/SMSController";
import ChatController from "./routers/Chat/chatController";
import * as http from 'http'
import ChatServer from "./socket"


const port = 3000;

const app = new App([
  new UserController(),
  new PostController(),
  new SMSController(),
  new ChatController(),
]).app;

const server = http.createServer(app);
const chatServer = new ChatServer(server,app)

server.listen(port, function () {
  console.log("Express listening on port", port);
});
