"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
var Events;
(function (Events) {
    Events["CONNECTION"] = "connection";
    Events["DISCONNECT"] = "disconnect";
    Events["MESSAGE"] = "message";
    Events["CONNECT_ROOM"] = "connectRoom";
    Events["DISCONNECT_ROOM"] = "disconnectRoom";
})(Events || (Events = {}));
class ChatServer {
    constructor(server, app) {
        this.app = app;
        this.roomId = "";
        this.server = server;
        this.io = new socket_io_1.default.Server(this.server);
        this.app.set("io", this.io);
        this.room = this.io.of("/chat");
        this.run();
    }
    run() {
        this.room.on(Events.CONNECTION, (socket) => {
            console.log("chat 네임스페이스 접속");
            socket.on(Events.CONNECT_ROOM, (data) => {
                this.roomId = data.roomId;
                console.log(data.roomId);
                socket.join(data.roomId);
            });
            socket.on(Events.DISCONNECT_ROOM, () => {
                console.log("chat 네임스페이스 접속 해제");
                socket.leave(this.roomId);
            });
            socket.on(Events.MESSAGE, (data) => {
                console.log(data);
                socket.to(data.room).emit(data);
            });
            socket.on(Events.DISCONNECT, () => {
                console.log("chat 접속 해제 ");
            });
        });
    }
}
exports.default = ChatServer;
