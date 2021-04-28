import express, { RequestHandler } from "express";
import Controller from "./interfaces/controller";
import Post from "../models/Post/interface";
import PostModel from "../models/Post/model";
import validation from "../middlewares/validation";
import PostDto from "../models/Post/dto";
import "dotenv/config";

class PostController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private post = PostModel;
  private dto = PostDto;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, validation(this.dto, true), this.createPost);
  }

  private createPost: RequestHandler = async (req, res, next) => {
    const postData: Post = req.body;
    const createPost = new this.post({ ...postData });
    try {
      await createPost.save();
      res.send({ result: createPost });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}
export default PostController;
