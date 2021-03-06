import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Controller from "./routers/interfaces/controller";
import morgan from "morgan";
import "dotenv/config";
import { Job } from "node-schedule";
import { scheduleJob } from "./middlewares/schedule";
import helmet from "helmet";
import hpp from "hpp";

class App {
  app: express.Application;
  schedule: Job;
  constructor(controllers: Controller[]) {
    this.app = express();
    this.setDB();
    this.setMiddleWare();
    this.setRouter(controllers);
    this.set404Error();
    this.setError();
    this.schedule = scheduleJob;
  }
  private setDB() {
    const databaseName = process.env.NODE_ENV === "production" ? "admin" : "test";
    mongoose
      .connect(`mongodb://localhost:27017/${databaseName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        ignoreUndefined: true,
        useFindAndModify: false,
        // user: process.env.DB_USER,
        // pass: process.env.DB_PASSWORD,
      })
      .then(() => console.log("db connected"))
      .catch((err) => console.log(err));
  }
  private setMiddleWare() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());

    if (process.env.NODE_ENV === "production") {
      this.app.use(morgan("combined"));
      this.app.use(helmet({ contentSecurityPolicy: false }));
      this.app.use(hpp());
    } else {
      this.app.use(morgan("dev"));
    }
  }
  private setRouter(controllers: Controller[]) {
    this.app.get("/", (req, res) => {
      res.send("hello");
    });
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
  private set404Error() {
    this.app.use((req, res, _) => {
      res.status(404).send("404");
    });
  }
  private setError() {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.log(err);
      res.status(500).send({ err: err.message });
    });
  }
}

export default App;
