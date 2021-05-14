"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const schedule_1 = require("./middlewares/schedule");
class App {
    constructor(controllers) {
        this.app = express_1.default();
        this.setDB();
        this.setMiddleWare();
        this.setRouter(controllers);
        this.set404Error();
        this.setError();
        this.schedule = schedule_1.scheduleJob;
    }
    setDB() {
        mongoose_1.default
            .connect("mongodb://3.34.137.188:27017/admin", {
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
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json());
        this.app.use(morgan_1.default("dev"));
    }
    setRouter(controllers) {
        this.app.get("/", (req, res) => {
            res.send("hello");
        });
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
    set404Error() {
        this.app.use((req, res, _) => {
            res.status(404).send("404");
        });
    }
    setError() {
        this.app.use((err, req, res, next) => {
            console.log(err);
            res.status(500).send({ err: err.message });
        });
    }
}
exports.default = App;
