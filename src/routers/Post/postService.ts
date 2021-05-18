import { Post, PostModel } from "../../models/Post";
import { User, UserModel } from "../../models/User";
import { Meeting, userInfo } from "../config";
import { rand } from "../../middlewares/utile";

export default class PostService {
  private postModel = PostModel;
  private userModel = UserModel;
  constructor() { }

  createPost = async (postData: Post, userId: string): Promise<Post> => {
    if (new Date(postData.startDate) <= new Date())
      throw new Error("지난 날짜를 시작일로 설정할 수 없습니다.");
    if (postData.location?.length === 1) throw new Error("위치 정보가 잘못되었습니다.")
    if (postData.location?.length === 2) {
      postData.offLocation = []
      const randLat = rand(-400, 400);
      const offsetLat = randLat * 0.000001;
      postData.offLocation[0] = Number((postData.location[0] + offsetLat).toFixed(6));
      const randLng = rand(-400, 400);
      const offsetLng = randLng * 0.000001;
      postData.offLocation[1] = Number((postData.location[1] + offsetLng).toFixed(6));
    }
    const newPost = new this.postModel({ ...postData, user: userId });
    await newPost.save();
    return newPost;
  };

  updatePost = async (
    postUpdateData: Post,
    userId: string,
    postId: string
  ): Promise<Post | null> => {
    const post = await this.postModel.findOneAndUpdate(
      {
        _id: postId,
        user: userId,
      },
      { ...postUpdateData },
      { new: true }
    );
    if (!post) new Error("작성하신 글이 존재하지 않습니다.");
    return post;
  };

  deletePost = async (userId: string, postId: string): Promise<void> => {
    const post = await PostModel.findOneAndDelete().and([
      { user: userId },
      { _id: postId },
    ]);
    if (!post) throw new Error("작성하신 글이 존재하지 않습니다.");
  };

  getPostById = async (postId: string): Promise<Post | null> => {
    const post = await this.postModel
      .findById({ _id: postId }, { location: 0 })
      .populate("user", userInfo)
      .populate("participants", userInfo);
    return post;
  };

  //포스트 가져오기(검색 포함!)
  getPosts = async (
    page2: number,
    meeting: string,
    category: string,
    keyword: string
  ): Promise<Post[]> => {
    const posts = await this.postModel
      .find({}, { location: 0 })
      .and([
        { status: true },
        { meeting },
        { category },
        {
          $or: [
            { title: { $regex: keyword } },
            { hashtag: { $regex: keyword } },
            { category: { $regex: keyword } },
          ],
        },
      ])
      .populate("user", userInfo)
      .populate("participants", userInfo)
      .sort("-createdAt")
      .skip((page2 - 1) * 5)
      .limit(5);

    return posts;
  };

  addParticipant = async (
    postId: string,
    userId: string,
    participantId: string
  ): Promise<void> => {
    const [participant, post] = await Promise.all([
      this.userModel.findOne({ _id: participantId }),
      this.postModel.findOne({ _id: postId, user: userId }),
    ]);
    if (!participant) throw new Error("잘못된 참가자 정보입니다.");
    if (!post) throw new Error("잘못된 정보가 기재되었습니다."); // postId 또는 작성자(user)가 잘못된 경우
    if (userId == participant._id)
      throw new Error("본인은 참가자로 넣거나 뺄 수 없습니다.");
    if (post.participants.includes(participant._id))
      throw new Error("이미 참가 확정된 팀원입니다.");
    if (post.participants.length >= post.personnel)
      throw new Error("참여인원이 초과했습니다.");
    //참여인원에 추가하기
    await this.postModel.findByIdAndUpdate(
      { _id: post._id },
      { $push: { participants: participant._id } }
    );
  };

  deleteParticipant = async (
    postId: string,
    userId: string,
    participantId: string
  ): Promise<void> => {
    const [participant, post] = await Promise.all([
      this.userModel.findOne({ _id: participantId }),
      this.postModel.findOne({ _id: postId, user: userId }),
    ]);
    if (!participant) throw new Error("잘못된 참가자 정보입니다.");
    if (!post) throw new Error("잘못된 정보가 기재되었습니다.");
    if (userId == participant._id)
      throw new Error("본인은 참가자로 넣거나 뺄 수 없습니다.");
    if (!post.participants.includes(participant._id))
      throw new Error("참여 인원에 해당 사용자의 정보가 없습니다.");
    //참여 인원에서 삭제하기
    await this.postModel.findByIdAndUpdate(
      { _id: post._id },
      { $pull: { participants: participant._id } }
    );
  };

  updatePostStatus = async (postId: string, userId: string): Promise<void> => {
    const post = await this.postModel.findOneAndUpdate(
      {
        _id: postId,
        user: userId,
      },
      { status: false },
      { new: true }
    );
    if (!post) throw new Error("잘못된 정보가 기재되었습니다.");
  };
}
