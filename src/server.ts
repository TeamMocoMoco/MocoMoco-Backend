import App from "./app";
const port = 3000;

const app = new App().app;
app.listen(port, function () {
  console.log("Express listening on port", port);
});
