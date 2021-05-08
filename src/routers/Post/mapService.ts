import { Post, PostModel } from "../../models/Post";
import { rand } from "../../middlewares/utile";

const axios = require('axios').default;

class MapService {
  private post = PostModel;
  constructor() { }

  getLocationSearch = async (
    keyword: string
  ): Promise<any> => {
    try {
      const findPlaceFromText = await axios
        .get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&fields=geometry&input=`
          + encodeURI(keyword) + `&key=${process.env.GOOGLE_API_KEY}`)
      if (!findPlaceFromText.data.candidates[0]) throw new Error("검색 결과가 없습니다")
      const locationLat = findPlaceFromText.data.candidates[0].geometry.location.lat
      const locationLng = findPlaceFromText.data.candidates[0].geometry.location.lng
      const coordinate = `${locationLat}` + ',' + `${locationLng}`
      const response = await axios
        .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinate}&radius=5000&language=ko&keyword=`
          + encodeURI(keyword) + `&key=${process.env.GOOGLE_API_KEY}`);
      return response
    } catch (err) {
      throw new Error(err)
    }
  }

  getLocationToken = async (token: string): Promise<any> => {
    try {
      const response = await axios
        .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${token}&key=${process.env.GOOGLE_API_KEY}`)
      return response
    } catch (err) {
      throw new Error(err)
    }
  }

  getLatLng = async (LatLng: string): Promise<{ Lat: number, Lng: number }> => {
    try {
      // LatLng = 11.111,22.222
      const indexOfComma = LatLng.indexOf(",");

      const Lat: number = +LatLng.slice(0, indexOfComma)
      const Lng: number = +LatLng.substr(indexOfComma + 1)
      return { Lat, Lng }
    } catch (err) {
      throw new Error(err)
    }
  }

  getMapPostsByCenter = async (Lat: number, Lnt: number): Promise<Post[]> => {
    try {
      const posts = await this.post.find({ status: true })
      // const distanceList = []
      // for (let i of posts) {
      //   console.log(i)
      // }
      return posts
    } catch (err) {
      throw new Error(err)
    }
  }

  getMapPostsByBounds = async (
    sBound: number,
    nBound: number,
    wBound: number,
    eBound: number
  ): Promise<Post[]> => {
    try {
      const posts = await this.post.find({
        $and: [
          { status: true },
          { "location": { $size: 2 } },
          { "location.0": { $gt: sBound, $lt: nBound } },
          { "location.1": { $gt: wBound, $lt: eBound } },
        ],
      });
      posts.map((post: Post) => {
        if (post.location) {
          const randLat = rand(-400, 400);
          const offsetLat = randLat * 0.000001
          post.location[0] = post.location[0] + offsetLat
          const randLng = rand(-40000, 40000);
          const offsetLng = randLng * 0.000001
          post.location[1] = post.location[1] + offsetLng
          return post
        }
      })
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  };

}

export default MapService;
