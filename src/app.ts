import express, { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import cors from "cors"
import Controller from "./routers/interfaces/controller"
import "dotenv/config"

class App {
  app: express.Application
  constructor(controllers: Controller[]) {
    this.app = express()
    this.setDB()
    this.setMiddleWare()
    this.setRouter(controllers)
    this.set404Error()
    this.setError()
  }
  private setDB() {
    mongoose
      .connect("mongodb://localhost:27017/admin", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        ignoreUndefined: true,
        useFindAndModify: false,
        // user: process.env.DB_USER,
        // pass: process.env.DB_PASSWORD,
      })
      .then(() => console.log("db connected"))
      .catch((err) => console.log(err))
  }
  private setMiddleWare() {
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())
  }
  private setRouter(controllers: Controller[]) {
    this.app.get("/", (req, res) => {
      res.send("hello")
    })
    controllers.forEach((controller) => {
      this.app.use("/", controller.router)
    })
  }
  private set404Error() {
    this.app.use((req, res, _) => {
      res.status(404).send("404")
    })
  }
  private setError() {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.log(err)
      res.status(500).send(err.message)
    })
  }
}

export default App
