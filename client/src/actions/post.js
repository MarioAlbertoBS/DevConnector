import axios from "axios";
import { setAlert } from "./alert";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";

//Get posts
export const getPosts = () => async (dispatch) => {
    await axios
        .get("/api/posts")
        .then((res) => {
            dispatch({
                type: GET_POSTS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Add Like
export const addLike = (id) => async (dispatch) => {
    await axios
        .put(`/api/posts/like/${id}`)
        .then((res) => {
            dispatch({
                type: UPDATE_LIKES,
                payload: { id, likes: res.data },
            });
        })
        .catch((err) => {
            dispatch({
                type: POST_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};
