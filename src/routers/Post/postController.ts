import express, { RequestHandler } from "express";
import Controller from "../interfaces/controller";
import { Post, PostDto } from "../../models/Post";
import { validation, JwtValidation } from "../../middlewares/validation";
import PostService from "./postService";
import MapService from "./mapService";
import "dotenv/config";
import { Types } from "mongoose";

class PostController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private postService;
  private mapService;
  private dto = PostDto;
  constructor() {
    this.initializeRoutes();
    this.postService = new PostService();
    this.mapService = new MapService();
  }

  private initializeRoutes() {
    this.router.patch(`${this.path}/status`, this.changeStatus);
    //게시글 작성
    this.router.post(
      this.path,
      JwtValidation,
      validation(this.dto),
      this.createPost
    );
    //게시글 수정
    this.router.patch(
      `${this.path}/:postId`,
      JwtValidation,
      validation(this.dto, true),
      this.updatePost
    );
    this.router.get(`${this.path}/online`, this.getOnlinePosts); //온라인 게시물 카테고리 별, 검색
    this.router.get(`${this.path}/offline`, this.getOfflinePosts); //오프라인 게시물 카테고리 별, 검색
    this.router.get(`${this.path}/location`, this.getLocationSearch)
    this.router.get(`${this.path}/map`, this.getPostsInMap);
    this.router.post(
      `${this.path}/:postId/participants`,
      JwtValidation,
      this.addParticipant
    );
    this.router.delete(`${this.path}/:postId`, JwtValidation, this.deletePost); //게시글 삭제
    this.router.get(`${this.path}/:postId`, this.getPostById); //게시글 상세
    this.router.get(this.path, this.getAllPosts); //게시글 전체
  }

  //게시글 작성
  private createPost: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    const postData: Post = req.body;

    try {
      const newPost = await this.postService.createPost(postData, userId);
      res.send({ result: "success" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //게시글 상세
  private getPostById: RequestHandler = async (req, res, next) => {
    const { postId } = req.params;
    if (!Types.ObjectId.isValid(postId))
      next(new Error("오브젝트 아이디가 아닙니다."));
    try {
      const post = await this.postService.getPostById(postId);
      return res.send({ result: post });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //게시글 수정
  private updatePost: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    const postUpdateData: Post = req.body;
    const { postId } = req.params;
    if (!Types.ObjectId.isValid(postId))
      next(new Error("오브젝트 아이디가 아닙니다"));
    try {
      //해당 유저정보와 게시글 id로 찾고, 업데이트
      await this.postService.updatePost(postUpdateData, userId, postId);
      return res.send({ result: "success" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  //게시글 삭제
  private deletePost: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user;
    const { postId } = req.params;
    if (!Types.ObjectId.isValid(postId))
      next(new Error("오브젝트 아이디가 아닙니다."));

    try {
      await this.postService.deletePost(userId, postId);
      return res.send({ result: "success" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //게시글 전체보기 및 검색하기
  private getAllPosts: RequestHandler = async (req, res, next) => {
    const keyword = req.query.keyword as string;
    try {
      if (keyword) {
        const posts = await this.postService.getPostsByKeyword(keyword);
        return res.send({ result: posts });
      }
      const posts = await this.postService.getAllPosts();
      return res.send({ result: posts });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //게시글 온라인
  private getOnlinePosts: RequestHandler = async (req, res, next) => {
    const category = req.query.category as string;
    const keyword = req.query.keyword as string;
    try {
      //검색
      if (category && keyword) {
        const posts = await this.postService.getPostsByKeywordandCategory(
          keyword,
          category,
          "온라인"
        );
        return res.send({ result: posts });
      } else if (category) {
        const posts = await this.postService.getPostsByCategory(
          category,
          "온라인"
        );
        return res.send({ result: posts });
      }
      const posts = await this.postService.getAllPosts();
      return res.send({ result: posts });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //게시글 오프라인
  private getOfflinePosts: RequestHandler = async (req, res, next) => {
    const category = req.query.category as string;
    const keyword = req.query.keyword as string;
    try {
      //검색
      if (category && keyword) {
        const posts = await this.postService.getPostsByKeywordandCategory(
          keyword,
          category,
          "오프라인"
        );
        return res.send({ result: posts });
      } else if (category) {
        const posts = await this.postService.getPostsByCategory(
          category,
          "오프라인"
        );
        return res.send({ result: posts });
      }
      const posts = await this.postService.getAllPosts();
      return res.send({ result: posts });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  private getLocationSearch: RequestHandler = async (req, res, next) => {
    const next_page_token = req.query.token as string;
    const location = req.query.location as string;
    const keyword = req.query.keyword as string;

    try {
      if (next_page_token) {
        const locations = await this.mapService.getLocationToken(next_page_token)
        return res.send(locations.data)
      }
      const locations = await this.mapService.getLocationSearch(location, keyword)
      return res.send(locations.data)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  private getPostsInMap: RequestHandler = async (req, res, next) => {
    // sw가 낮은 쪽, ne가 높은쪽 *한국기준
    // /posts/map?sw=5,6&ne=150,160
    const sw = req.query.sw as string
    const ne = req.query.ne as string
    try {
      // bounds를 4개 숫자로 만들기 동 서 남 북
      const swNum = await this.mapService.getBounds(sw)
      const neNum = await this.mapService.getBounds(ne)
      // lat은 남북 높을수록 북쪽
      // lng은 동서 높을수록 동쪽 한국기준
      const sBound = swNum.Lat;
      const nBound = neNum.Lat;
      const wBound = swNum.Lng;
      const eBound = neNum.Lng;

      const posts = await this.mapService.getPostsInMap(
        sBound,
        nBound,
        wBound,
        eBound
      );
      return res.send({ result: posts });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  private addParticipant: RequestHandler = async (req, res, next) => {
    const { postId } = req.params;
    const userId = res.locals.user;
    const { participantId } = req.body;
    try {
      if (!Types.ObjectId.isValid(postId))
        next(new Error("오브젝트 아이디가 아닙니다"));
      await this.postService.addParticipant(postId, userId, participantId);
      return res.send({ result: "성공적으로 추가했습니다!" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  private deleteParticipant: RequestHandler = async (req, res, next) => { };

  private changeStatus: RequestHandler = async (req, res, next) => {
    await this.postService.changeStatus();
    return res.send({ result: "success" });
  };
}
export default PostController;
