import SocketIO from "socket.io";
import { Application } from "express";
import http from "http";

enum Events {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  MESSAGE = "message",
  CONNECT_ROOM = "connectRoom",
  DISCONNECT_ROOM = "disconnectRoom",
}

export default class ChatServer {
  private server: http.Server;
  private io: SocketIO.Server;
  private room: SocketIO.Namespace;
  private roomId: string = "";

  constructor(server: http.Server, private app: Application) {
    this.server = server;
    this.io = new SocketIO.Server(this.server);
    this.app.set("io", this.io);
    this.room = this.io.of("/chat");
    this.run();
  }

  run() {
    this.room.on(Events.CONNECTION, (socket: SocketIO.Socket) => {
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
