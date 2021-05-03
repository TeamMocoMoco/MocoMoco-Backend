import { Post, PostModel } from "../../models/Post";
import { Room, RoomModel } from "../../models/Room";
import { User, UserModel } from "../../models/User";
type Meeting = "온라인" | "오프라인";
class PostService {
  private post = PostModel;
  private room = RoomModel;
  private user = UserModel;
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

  addParticipant = async (
    postId: string,
    userId: string,
    participantId: string
  ): Promise<void> => {
    try {
      const [participant, post] = await Promise.all([
        this.user.findOne({ _id: participantId }),
        this.post.findOne({ _id: postId, user: userId }),
      ]);
      if (!participant) throw new Error("잘못된 참가자 정보 입니다.");
      if (!post) throw new Error("잘못된 정보가 기재되었습니다."); // postId 또는 작성자(user)가 잘못된 경우
      if (userId == participant._id)
        throw new Error("본인은 참가자로 넣을 수 없습니다.");
      if (post.participants.includes(participant._id))
        throw new Error("이미 참가 확정된 팀원입니다.");
      if (post.participants.length >= post.personnel - 1)
        throw new Error("참여인원이 초과했습니다.");
      //참여인원에 추가하기
      await this.post.findByIdAndUpdate(
        { _id: post._id },
        { $push: { participants: participant._id } }
      );
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default PostService;
