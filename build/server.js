"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const userController_1 = __importDefault(require("./routers/User/userController"));
const postController_1 = __importDefault(require("./routers/Post/postController"));
const SMSController_1 = __importDefault(require("./routers/SMS/SMSController"));
const chatController_1 = __importDefault(require("./routers/Chat/chatController"));
const http = __importStar(require("http"));
const socket_1 = __importDefault(require("./socket"));
const port = process.env.PORT || 5000;
const app = new app_1.default([
    new userController_1.default(),
    new postController_1.default(),
    new SMSController_1.default(),
    new chatController_1.default(),
]).app;
const server = http.createServer(app);
const chatServer = new socket_1.default(server, app);
server.listen(port, async function () {
    //generateFakeData(5, 5)
    console.log("Server Start~!");
});
