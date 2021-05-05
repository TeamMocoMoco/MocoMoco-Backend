import { Post, PostModel } from "../../models/Post";
import { User, UserModel } from "../../models/User";
import { Meeting, userInfo, keywordOption } from "./config";

export default class PostService {
  private post = PostModel;
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
      const post = await this.post
        .findById(postId)
        .populate("user", userInfo)
        .populate("participants", userInfo);
      return post;
    } catch (err) {
      throw new Error(err);
    }
  };

  //전체 가져오기
  getAllPosts = async (): Promise<Post[]> => {
    try {
      const posts = await this.post
        .find({ status: true })
        .populate("user", userInfo)
        .populate("participants", userInfo)
        .sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };
  //Meeting별 전체 가져오기
  getPostsByMeeting = async (meeting: Meeting): Promise<Post[]> => {
    try {
      const posts = await this.post
        .find({ meeting, status: true })
        .populate("user", userInfo)
        .populate("participants", userInfo)
        .sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  //keyword별
  getPostsByKeyword = async (
    keyword: string,
    meeting: Meeting
  ): Promise<Post[]> => {
    try {
      console.log(keyword);
      console.log(meeting);
      const posts = await this.post
        .find({
          meeting,
          $or: [keywordOption(keyword)],
          status: true,
        })
        .populate("user", userInfo)
        .populate("participants", userInfo)
        .sort("-createdAt");
      console.log(posts);
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  getAllPostsByKeyword = async (keyword: string): Promise<Post[]> => {
    try {
      console.log(keyword);
      const posts = await this.post
        .find({
          $or: [
            { title: { $regex: keyword } },
            { content: { $regex: keyword } },
            { hashtag: { $regex: keyword } },
          ],
          status: true,
        })
        .populate("user", userInfo)
        .populate("participants", userInfo)
        .sort("-createdAt");
      console.log(posts);
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  //카테고리+키워드
  getPostsByKeywordAndCategory = async (
    keyword: string,
    category: string,
    meeting: Meeting
  ): Promise<Post[]> => {
    try {
      const posts = await this.post
        .find()
        .and([
          { meeting },
          { category },
          { status: true },
          {
            $or: [
              { title: { $regex: keyword } },
              { content: { $regex: keyword } },
              { hashtag: { $regex: keyword } },
            ],
          },
        ])
        .populate("user", userInfo)
        .populate("participants", userInfo)
        .sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  getAllPostsByKeywordAndCategory = async (
    keyword: string,
    category: string
  ): Promise<Post[]> => {
    try {
      const posts = await this.post
        .find()
        .and([
          { category },
          { status: true },
          {
            $or: [
              { title: { $regex: keyword } },
              { content: { $regex: keyword } },
              { hashtag: { $regex: keyword } },
            ],
          },
        ])
        .populate("user", userInfo)
        .populate("participants", userInfo)
        .sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };
  //카테고리
  getPostsByCategory = async (
    category: string,
    meeting: Meeting = "오프라인"
  ): Promise<Post[]> => {
    try {
      const posts = await this.post
        .find()
        .and([{ meeting }, { category }, { status: true }])
        .populate("user", userInfo)
        .populate("participants", userInfo)
        .sort("-createdAt");
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

  getAllPostsByCategory = async (category: string): Promise<Post[]> => {
    try {
      console.log(category);
      const posts = await this.post
        .find()
        .and([{ category }, { status: true }])
        .populate("user", userInfo)
        .populate("participants", userInfo)
        .sort("-createdAt");
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
      if (post.participants.length >= post.personnel)
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

  //스케쥴링
  changeStatus = async (): Promise<void> => {
    const date = Date.now();
    console.log(new Date(date));
    await this.post.updateMany(
      { startDate: { $lte: new Date(date) } },
      { $set: { status: false } }
    );
  };
}
