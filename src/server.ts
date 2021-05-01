import "dotenv/config";
import App from "./app";
import UserController from "./routers/User/userController";
import PostController from "./routers/Post/postController";
import SMSController from "./routers/SMS/SMSController";
import ChatController from "./routers/Chat/chatController";
const port = 3000;

const app = new App([
  new UserController(),
  new PostController(),
  new SMSController(),
  new ChatController(),
]).app;
app.listen(port, function () {
  console.log("Express listening on port", port);
});
