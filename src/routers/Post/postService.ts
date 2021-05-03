import { Post, PostModel } from "../../models/Post";
import { Room, RoomModel } from "../../models/Room";
type Meeting = "온라인" | "오프라인";
class PostService {
  private post = PostModel;
  private room = RoomModel;
  constructor() {}

  createPost = async (postData: Post, userId: string): Promise<Post> => {
    const newPost = new this.post({ ...postData, user: userId });
    try {
      await newPost.save();
      return newPost;
    } catch (err) {
      throw new Error(err);
    }
  };

  updatePost = async (
    postUpdateData: Post,
    userId: string,
    postId: string
  ): Promise<Post | null> => {
    try {
      const post = await this.post.findOneAndUpdate(
        {
          _id: postId,
          user: userId,
        },
        { ...postUpdateData },
        { new: true }
      );
      if (!post) new Error("작성하신 글이 존재하지 않습니다.");
      return post;
    } catch (err) {
      throw new Error(err);
    }
  };

  deletePost = async (userId: string, postId: string): Promise<void> => {
    try {
      const post = await PostModel.findOneAndDelete().and([
        { user: userId },
        { _id: postId },
      ]);
      if (!post) throw new Error("작성하신 글이 존재하지 않습니다.");
    } catch (err) {
      throw new Error(err);
    }
  };

  getPostById = async (postId: string): Promise<Post | null> => {
    try {
      const post = await this.post.findById(postId);
      return post;
    } catch (err) {
      throw new Error(err);
    }
  };

  getAllPosts = async (): Promise<Post[]> => {
    try {
      const posts = await this.post.find({}).sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  getPostsByKeyword = async (keyword: string): Promise<Post[]> => {
    try {
      const posts = await this.post
        .find({
          $or: [
            { title: { $regex: keyword } },
            { content: { $regex: keyword } },
            { hashtag: { $regex: keyword } },
          ],
        })
        .sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  getPostsByKeywordandCategory = async (
    keyword: string,
    category: string,
    meeting: Meeting = "오프라인"
  ): Promise<Post[]> => {
    try {
      const posts = await this.post
        .find()
        .and([
          { meeting },
          { category },
          {
            $or: [
              { title: { $regex: keyword } },
              { content: { $regex: keyword } },
              { hashtag: { $regex: keyword } },
            ],
          },
        ])
        .sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  getPostsByCategory = async (
    category: string,
    meeting: Meeting = "오프라인"
  ): Promise<Post[]> => {
    try {
      const posts = await this.post
        .find()
        .and([{ meeting }, { category: category }])
        .sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  getPostsInMap = async (
    sBound: number,
    nBound: number,
    wBound: number,
    eBound: number
  ): Promise<Post[]> => {
    try {
      const posts = await this.post.find({
        $and: [
          { "location.0": { $gt: sBound, $lt: nBound } },
          { "location.1": { $gt: wBound, $lt: eBound } },
        ],
      });
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  // addParticipant = async (
  //   roomId: string,
  //   userId: string,
  //   participantsId: string
  // ): Promise<void> => {
  //   try{
  //     const room = await this.room.findById(roomId)
  //     if (!room) throw new Error("오브젝트 아이디의")
  //   }
  // };
}

export default PostService;
