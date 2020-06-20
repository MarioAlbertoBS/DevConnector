import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";

import { addLike, deletePost } from "../../actions/post";

const PostItem = ({
    auth,
    addLike,
    deletePost,
    post: { _id, text, name, avatar, user, likes, comments, date },
    showActions,
}) => {
    //Get likes
    const pst =
        !auth.loading && likes.find((obj) => obj.user === auth.user._id);

    const buttonColor = pst ? "dark" : "light";

    return (
        <div className="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img className="round-img" src={avatar} alt="" />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">{text}</p>
                <p className="post-date">
                    Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
                </p>
                {showActions && (
                    <Fragment>
                        <button
                            type="button"
                            className={`btn btn-${buttonColor}`}
                            onClick={(e) => addLike(_id)}
                        >
                            <i className="fas fa-thumbs-up"></i>{" "}
                            {likes.length > 0 && <span>{likes.length}</span>}
                        </button>
                        <Link to={`/post/${_id}`} className="btn btn-primary">
                            Discussion{" "}
                            {comments.length > 0 && (
                                <span className="comment-count">
                                    {comments.length}
                                </span>
                            )}
                        </Link>
                        {!auth.loading && user === auth.user._id && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={(e) => deletePost(_id)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    );
};

PostItem.defaultProps = {
    showActions: true,
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    showActions: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { addLike, deletePost })(PostItem);
