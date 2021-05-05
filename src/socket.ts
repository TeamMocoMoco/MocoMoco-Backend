import SocketIO from "socket.io"
import { Application } from "express"
import http from "http"

enum Events {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  INIT = "init",
  MESSAGE = "message",
  CONNECT_ROOM = "connectRoom",
  DISCONNECT_ROOM = "disconnectRoom",
  DISCONNECT_USER = "disconnectUser",

}

export default class ChatServer {
  private server: http.Server
  private io: SocketIO.Server
  private room:SocketIO.Namespace

  constructor(server: http.Server,private app:Application) {
    this.server = server
    this.io = new SocketIO.Server(this.server)
    this.app.set('io',this.io)
    this.room = this.io.of('/room')
    this.run()
  }

  run(){
    this.room.on(Events.CONNECTION,(socket:SocketIO.Socket)=>{
      console.log("chat 네임스페이스 접속")
      const req:http.IncomingMessage = socket.request
      const roomInfoUrl = req.headers.referer
      if(!roomInfoUrl){
        console.log("방정보가 없습니다.")
        return 
      } 
      const roomId = roomInfoUrl
      .split('/')[roomInfoUrl.split('/').length - 1]
      .replace(/\?.+/, '');
      socket.join(roomId)
      
      socket.on(Events.DISCONNECT,()=>{
        console.log("chat 네임스페이스 접속 해제")
        socket.leave(roomId)
      })

      socket.on(Events.MESSAGE,(data) =>{
        socket.to(data.room).emit(data)
      })
    })
  }

}
