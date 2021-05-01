import SocketIO from "socket.io"
import express, { Application } from "express"
import http from "http"

enum Events {
  CONNECTION = "connection",
  INIT = "init",
  MESSAGE = "message",
  CONNECT_ROOM = "connectRoom",
  DISCONNECT_ROOM = "disconnectRoom",
  DISCONNECT_USER = "disconnectUser",
}

export default class ChatServer {
  private server: http.Server
  private io: SocketIO.Server

  constructor(server: http.Server) {
    this.server = server
    this.io = new SocketIO.Server(this.server)
  }
}
