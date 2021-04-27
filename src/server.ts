import "dotenv/config";
import App from "./app";
import UserController from "./routers/userController";
const port = 3000;

const app = new App([new UserController()]).app;
app.listen(port, function () {
  console.log("Express listening on port", port);
});
