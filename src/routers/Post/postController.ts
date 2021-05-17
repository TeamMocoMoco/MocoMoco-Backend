import express, { RequestHandler } from "express"
import Controller from "../interfaces/controller"
import { Post, PostDto, ParticipantDto } from "../../models/Post"
import { validation, JwtValidation } from "../../middlewares/validation"
import PostService from "./postService"
import MapService from "./mapService"
import { Types } from "mongoose"

export default class PostController implements Controller {
  public path = "/posts"
  public router = express.Router()
  private postService
  private mapService

  constructor() {
    this.initializeRoutes()
    this.postService = new PostService()
    this.mapService = new MapService()
  }

  private initializeRoutes() {
    //게시글 작성
    this.router.post(this.path, JwtValidation, validation(PostDto, true), this.createPost)
    //게시글 수정
    this.router.patch(
      `${this.path}/:postId`,
      JwtValidation,
      validation(PostDto, true),
      this.updatePost
    )
    this.router.patch(`${this.path}/:postId/status`, JwtValidation, this.updatePostStatus) //게시글 마감
    this.router.get(`${this.path}/location`, this.getLocationSearch)
    this.router.get(`${this.path}/map`, this.getPostsInMap)
    this.router.post(
      `${this.path}/:postId/participants`,
      JwtValidation,
      validation(ParticipantDto),
      this.addParticipant
    ) //참여자 추가하기
    this.router.patch(
      `${this.path}/:postId/participants`,
      JwtValidation,
      validation(ParticipantDto),
      this.deleteParticipant
    ) //침여자 삭제하기
    this.router.delete(`${this.path}/:postId`, JwtValidation, this.deletePost) //게시글 삭제
    this.router.get(`${this.path}/:postId`, this.getPostById) //게시글 상세
    this.router.get(this.path, this.getPosts) //게시글 보기(검색 포함)
  }

  //게시글 작성
  private createPost: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user
    const postData: Post = req.body

    try {
      const newPost = await this.postService.createPost(postData, userId)
      res.send({ result: "success" })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  //게시글 상세
  private getPostById: RequestHandler = async (req, res, next) => {
    const { postId } = req.params
    if (!Types.ObjectId.isValid(postId)) return next(new Error("오브젝트 아이디가 아닙니다."))
    try {
      const post = await this.postService.getPostById(postId)
      return res.send({ result: post })
    } catch (err) {
      next(err)
    }
  }

  //게시글 수정
  private updatePost: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user
    const postUpdateData: Post = req.body
    const { postId } = req.params
    if (!Types.ObjectId.isValid(postId)) return next(new Error("오브젝트 아이디가 아닙니다"))
    try {
      //해당 유저정보와 게시글 id로 찾고, 업데이트
      await this.postService.updatePost(postUpdateData, userId, postId)
      return res.send({ result: "success" })
    } catch (err) {
      next(err)
    }
  }

  //게시글 삭제
  private deletePost: RequestHandler = async (req, res, next) => {
    const userId = res.locals.user
    const { postId } = req.params
    if (!Types.ObjectId.isValid(postId)) return next(new Error("오브젝트 아이디가 아닙니다."))

    try {
      await this.postService.deletePost(userId, postId)
      return res.send({ result: "success" })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  //게시글 보기(검색 포함)
  private getPosts: RequestHandler = async (req, res, next) => {
    const page = req.query.page || "1"
    const page2: number = +page
    const meeting = req.query.meeting as string
    const category = req.query.category as string
    const keyword = (req.query.keyword as string) || ""

    try {
      const posts: Post[] = await this.postService.getPosts(page2, meeting, category, keyword)
      return res.send({ result: posts })
    } catch (err) {
      next(err)
    }
  }

  // 위치 검색 결과
  private getLocationSearch: RequestHandler = async (req, res, next) => {
    const next_page_token = req.query.token as string
    const keyword = req.query.keyword as string

    try {
      if (next_page_token) {
        const locations = await this.mapService.getLocationByToken(next_page_token)
        return res.send(locations.data)
      }
      if (!keyword) {
        throw new Error("검색어가 없습니다.")
      }
      const locations = await this.mapService.getLocationBySearch(keyword)
      return res.send(locations.data)
    } catch (err) {
      next(err)
    }
  }

  // 지도 검색
  private getPostsInMap: RequestHandler = async (req, res, next) => {
    const center = req.query.center as string
    if (center) {
      try {
        const centerNum = await this.mapService.getLatLng(center)
        const Lat = centerNum.Lat
        const Lng = centerNum.Lng
        const posts = await this.mapService.getMapPostsByCenter(Lat, Lng)
        const randomziedPosts = await this.mapService.randomizeLocation(posts)
        return res.send({ result: randomziedPosts })
      } catch (err) {
        next(err)
      }
    }
  }

  //참여자 추가
  private addParticipant: RequestHandler = async (req, res, next) => {
    const { postId } = req.params
    const userId = res.locals.user
    const { participantId } = req.body
    if (!Types.ObjectId.isValid(postId)) return next(new Error("오브젝트 아이디가 아닙니다"))
    try {
      await this.postService.addParticipant(postId, userId, participantId)
      return res.send({ result: "성공적으로 참가자를 추가했습니다!" })
    } catch (err) {
      next(err)
    }
  }

  //참여자 삭제
  private deleteParticipant: RequestHandler = async (req, res, next) => {
    const { postId } = req.params
    const userId = res.locals.user
    const { participantId } = req.body
    if (!Types.ObjectId.isValid(postId)) return next(new Error("오브젝트 아이디가 아닙니다."))
    try {
      await this.postService.deleteParticipant(postId, userId, participantId)
      return res.send({ result: "성공적으로 참가자를 삭제했습니다." })
    } catch (err) {
      next(err)
    }
  }

  //게시글 마감(status true -> false)
  private updatePostStatus: RequestHandler = async (req, res, next) => {
    const { postId } = req.params
    const userId = res.locals.user
    if (!Types.ObjectId.isValid(postId)) return next(new Error("오브젝트 아이디가 아닙니다."))
    try {
      await this.postService.updatePostStatus(postId, userId)
      return res.send({ result: "success" })
    } catch (err) {
      next(err)
    }
  }
}
