import { Post, PostModel } from "../../models/Post";
import { User, UserModel } from "../../models/User";
// import axios, { AxiosPromise } from 'axios';

const userInfo = "name role userImg";
const axios = require('axios').default;

class MapService {
    private post = PostModel;
    private user = UserModel;
    constructor() { }

    getLocationSearch = async (
        location: string,
        keyword: string
    ): Promise<any> => {
        try {
            const response = await axios
                .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=1500&language=ko&keyword=`
                    + encodeURI(keyword) + `&key=AIzaSyA5DBIUlgHZNT_YR1CP1QoK8XpcTjbRCEY`);
            return response
        } catch (err) {
            throw new Error(err)
        }
    }

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

}

export default MapService;
