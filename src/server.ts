import "dotenv/config";
import App from "./app";
import UserController from "./routers/User/userController";
import PostController from "./routers/postController";
import SMSController from "./routers/SMSController";
const port = 3000;

const app = new App([new UserController(), new PostController(), new SMSController()]).app;
app.listen(port, function () {
  console.log("Express listening on port", port);
});
