import express, { Request, Response, NextFunction, Router } from "express";
import "reflect-metadata";

enum Methods {
  get = "get",
  post = "post",
  delete = "delete",
  patch = "patch",
  put = "put",
}

@controller("/post")
class PostController {
  constructor() {}

  @getAPI("/")
  async getPost(req: Request, res: Response, next: NextFunction) {
    res.send({ result: "success" });
  }

  @postAPI("/")
  async createPost(req: Request, res: Response, next: NextFunction) {
    res.send({ result: "success" });
  }
}

function controller(path: string) {
  const router = express.Router();
  return function (target: any) {
    const methods = Object.getOwnPropertyNames(target.prototype);

    for (let key of methods) {
      const pathRouter = Reflect.getMetadata("path", target.prototype, key);
      const method: Methods = Reflect.getMetadata(
        "path",
        target.prototype,
        key
      );

      if (path) {
        router[method](`${path}${pathRouter}`, target[key]);
      }
    }
  };
}

function getAPI(pathPreFix: string) {
  return function (target: any, key: string) {
    Reflect.defineMetadata("path", pathPreFix, target.prototype, key);
    Reflect.defineMetadata("method", "get", target.prototype, key);
  };
}

function postAPI(pathPreFix: string) {
  return function (target: any, key: string) {
    Reflect.defineMetadata("path", pathPreFix, target.prototype, key);
    Reflect.defineMetadata("method", "post", target.prototype, key);
  };
}
