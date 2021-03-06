import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILES,
    GET_REPOS,
} from "./types";

import axios from "axios";
import { setAlert } from "./alert";

//Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
    await axios
        .get("/api/profile/me")
        .then((res) => {
            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: CLEAR_PROFILE,
            });
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Get all profiles
export const getProfiles = () => async (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });
    await axios
        .get("/api/profile")
        .then((res) => {
            dispatch({
                type: GET_PROFILES,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Get a profile by id
export const getProfileById = (userId) => async (dispatch) => {
    await axios
        .get(`/api/profile/user/${userId}`)
        .then((res) => {
            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Get GitHub Repose
export const getGithubRepos = (githubusername) => async (dispatch) => {
    await axios
        .get(`/api/profile/github/${githubusername}`)
        .then((res) => {
            dispatch({
                type: GET_REPOS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Create or update profile
export const createProfile = (formData, history, edit = false) => async (
    dispatch
) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    await axios
        .post("/api/profile", formData, config)
        .then((res) => {
            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            });

            dispatch(
                setAlert(
                    edit ? "Profile Updated" : "Profile Created",
                    "success"
                )
            );

            if (!edit) {
                history.push("/dashboard");
            }
        })
        .catch((err) => {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Add experience
export const addExperience = (formData, history) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    await axios
        .put("/api/profile/experience", formData, config)
        .then((res) => {
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert("Experience added", "success"));

            history.push("/dashboard");
        })
        .catch((err) => {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Add education
export const addEducation = (formData, history) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    await axios
        .put("/api/profile/education", formData, config)
        .then((res) => {
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert("Education added", "success"));

            history.push("/dashboard");
        })
        .catch((err) => {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
    await axios
        .delete(`/api/profile/experience/${id}`)
        .then((res) => {
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert("Experience Removed", "success"));
        })
        .catch((err) => {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Edit Experience
export const editExperience = (formData, id, history) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    axios
        .put(`/api/profile/experience/${id}`, formData, config)
        .then((res) => {
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert("Experience Updated", "success"));

            history.push("/dashboard");
        })
        .catch((err) => {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Delete Education
export const deleteEducation = (id) => async (dispatch) => {
    await axios
        .delete(`/api/profile/education/${id}`)
        .then((res) => {
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert("Education Removed", "success"));
        })
        .catch((err) => {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};

//Edit Education
export const editEducation = (formData, id, history) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    axios
        .put(`/api/profile/education/${id}`, formData, config)
        .then((res) => {
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert("Education Updated", "success"));

            history.push("/dashboard");
        })
        .catch((err) => {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        });
};
//Delete Account and Profile
export const deleteAccount = () => async (dispatch) => {
    if (window.confirm("Are you sure? This can NOT be undone!")) {
        await axios
            .delete(`/api/profile`)
            .then((res) => {
                dispatch({ type: CLEAR_PROFILE });
                dispatch({ type: ACCOUNT_DELETED });

                dispatch(setAlert("Your account has been permanently deleted"));
            })
            .catch((err) => {
                dispatch({
                    type: PROFILE_ERROR,
                    payload: {
                        msg: err.response.statusText,
                        status: err.response.status,
                    },
                });
            });
    }
};
