import { Post, PostModel } from "../../models/Post";
import { rand } from "../../middlewares/utile";

const axios = require("axios").default;

class MapService {
  private postModel = PostModel;
  constructor() {}

  getLocationSearch = async (keyword: string): Promise<any> => {
    // 키워드에 제일 근접한 장소 한 곳 검색
    const findPlaceFromText = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&fields=geometry&input=` +
        encodeURI(keyword) +
        `&key=${process.env.GOOGLE_API_KEY}`
    );

    // 검색 결과가 없는 경우
    if (!findPlaceFromText.data.candidates[0])
      throw new Error("검색 결과가 없습니다");

    // 검색 결과의 좌표 가져오기
    const location = findPlaceFromText.data.candidates[0].geometry.location;
    const coordinate = `${location.lat}` + "," + `${location.lng}`;

    // 좌표와 키워드로 장소 리스트 검색 + 리스트 JSON으로 보내기
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinate}&radius=5000&language=ko&keyword=` +
        encodeURI(keyword) +
        `&key=${process.env.GOOGLE_API_KEY}`
    );
    return response;
  };

  getLocationToken = async (token: string): Promise<any> => {
    // 장소 추가 검색 시 토큰으로 검색
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${token}&key=${process.env.GOOGLE_API_KEY}`
    );
    return response;
  };

  getLatLng = async (LatLng: string): Promise<{ Lat: number; Lng: number }> => {
    // str으로 좌표를 받으면 Lat Lng으로 변환
    const indexOfComma = LatLng.indexOf(",");

    const Lat: number = +LatLng.slice(0, indexOfComma);
    const Lng: number = +LatLng.substr(indexOfComma + 1);
    return { Lat, Lng };
  };

  getMapPostsByCenter = async (Lat: number, Lng: number): Promise<Post[]> => {
    // 지도의 중앙 지점을 받을 시 중앙에서 가까운 순으로 post 검색
    const postsMaxNum = 20;
    const posts = await this.postModel.find({
      $and: [{ status: true }, { meeting: "오프라인" }],
    });
    const distanceList = [];
    for (let i = 0; i < posts.length; i++) {
      const location = posts[i].location;
      if (location) {
        const distance = (location[0] - Lat) ** 2 + (location[1] - Lng) ** 2;
        distanceList.push({ i, distance });
      }
    }
    distanceList.sort(function (a, b) {
      return a.distance - b.distance;
    });
    const postsList = [];
    if (distanceList.length > postsMaxNum) {
      for (let j = 0; j < postsMaxNum; j++) {
        postsList.push(posts[distanceList[j].i]);
      }
      return postsList;
    }
    return posts;
  };

  getMapPostsByBounds = async (
    sBound: number,
    nBound: number,
    wBound: number,
    eBound: number
  ): Promise<Post[]> => {
    // 지도의 경계 좌표를 받을 시 경계 안의 post 검색
    const posts = await this.postModel.find({
      $and: [
        { status: true },
        { meeting: "오프라인" },
        { location: { $size: 2 } },
        { "location.0": { $gt: sBound, $lt: nBound } },
        { "location.1": { $gt: wBound, $lt: eBound } },
      ],
    });
    return posts;
  };

  randomizeLocation = async (posts: Post[]): Promise<Post[]> => {
    posts.map((post: Post) => {
      if (post.location) {
        const randLat = rand(-400, 400);
        const offsetLat = randLat * 0.000001;
        post.location[0] = post.location[0] + offsetLat;
        post.location[0] = Number(post.location[0].toFixed(6));
        const randLng = rand(-400, 400);
        const offsetLng = randLng * 0.000001;
        post.location[1] = post.location[1] + offsetLng;
        post.location[1] = Number(post.location[1].toFixed(6));
        return post;
      }
    });
    return posts;
  };
}

export default MapService;
