import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";

require("dotenv").config();

class App {
  app: express.Application;
  constructor() {
    this.app = express();
    this.setDB();
    this.setMiddleWare();
    this.setRouter();
    this.set404Error();
    this.setError();
  }
  setDB() {
    mongoose
      .connect("mongodb://13.125.248.86:27017/admin", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        ignoreUndefined: true,
        useFindAndModify: false,
        user: process.env.DB_USER,
        pass: process.env.DB_PASSWORD,
      })
      .then(() => console.log("db connected"))
      .catch((err) => console.log(err));
  }
  setMiddleWare() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
  }
  setRouter() {
    this.app.get("/", (req, res) => {
      res.send("hello");
    });
  }
  set404Error() {
    this.app.use((req, res, _) => {
      res.status(404).send("404");
    });
  }
  setError() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log(err);
        res.status(500).send("500");
      }
    );
  }
}

export default App;
