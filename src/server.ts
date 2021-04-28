import "dotenv/config";
import App from "./app";
import UserController from "./routers/userController";
import PostController from "./routers/postController";
const port = 3000;

const app = new App([new UserController(), new PostController()]).app;
app.listen(port, function () {
  console.log("Express listening on port", port);
});
