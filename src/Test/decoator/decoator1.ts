import { Request, Response, NextFunction } from "express";
import express from "express";
class Boat {
  private color: string;
  constructor() {
    this.color = "red";
  }

  //@aaa("hi go~~~")
  go() {
    console.log("hello world~~~~");
  }

  @bbb("hoho")
  @aaa("hi play~~~~")
  play() {
    console.log("heloo world!!!!!!");
  }
}

function aaa(log: string) {
  return function (target: any, key: string) {
    console.log("target", target); // Boat.prototype
    console.log("key", key); // go, play
    console.log("aaa", log);
  };
}

function bbb(log: string) {
  return function (target: any, key: string) {
    console.log("target", target); // Boat.prototype
    console.log("key", key); // go, play
    console.log("bbb", log);
  };
}

function classDeco(target: any) {
  console.log(target);
  const b = new target();
  console.log(b.color);
  b.go();
}

// this.router.get(`${this.path},this.getRooms);
function get(path: string) {
  return function (target: any, key: string) {
    const router = express.Router();
    router.get(`${path}`, target[key]);
  };
}
