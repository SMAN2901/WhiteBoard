import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getPostComments, postComment, likePost } from "../../api/BlogApi";
import { formatDate } from "../../services/util";
import staticValues from "../../staticValues.json";
import $ from "jquery";
import "./BlogComments.css";

class BlogComments extends Component {
    state = {
        comments: "pending",
        liked: false,
        loading: false,
        needUpdate: false
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        const { id } = this.props.match.params;

        try {
            const comments = await getPostComments(id);
            if (this._isMounted) {
                this.setState({ comments, liked: this.props.liked });
            }
        } catch (ex) {
            if (this._isMounted) {
                this.setState({ comments: [], liked: this.props.liked });
            }
        }
    }

    async componentDidUpdate() {
        const { id } = this.props.match.params;

        if (this.state.needUpdate || this.props.liked !== this.state.liked) {
            try {
                const comments = await getPostComments(id);
                if (this._isMounted) {
                    this.setState({
                        comments,
                        needUpdate: false,
                        liked: this.props.liked
                    });
                }
            } catch (ex) {}
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onPost = async e => {
        e.preventDefault();

        const inpClass = ".bcomments-inp";
        const btnClass = ".bcomments-btn";
        const text = $(inpClass)
            .val()
            .trim();
        const { popup, match, setUpdateTrigger } = this.props;
        const { id } = match.params;

        if (text.length < 1) return;

        try {
            this.setState({ loading: true });
            $(btnClass).text("Posting...");
            await postComment(id, { text });
            setUpdateTrigger();
            if (this._isMounted) {
                this.setState({ needUpdate: true, loading: false });
                $(btnClass).text("Post");
                $(inpClass).val("");
                popup.show("success", "Comment", "Posted");
            }
        } catch (ex) {
            popup.show("error", "Error", "Something went wrong");
            if (this._isMounted) {
                this.setState({ loading: false });
                $(btnClass).text("Post");
            }
        }
    };

    onLike = async () => {
        const { id } = this.props.match.params;
        const txtClass = ".bcomments-lbtn-text";
        const txt = $(txtClass).text();

        try {
            $(txtClass).text("Loading...");
            await likePost(id);
            this.props.setUpdateTrigger();
        } catch (ex) {
            $(txtClass).text(txt);
            this.props.setUpdateTrigger();
            this.props.popup.show("error", "Error", "Something went wrong");
        }
    };

    renderInputs = () => {
        if (
            this.props.user === "pending" ||
            this.props.user === null ||
            this.state.comments === "pending"
        ) {
            return null;
        }

        var { liked } = this.state;
        var { profile_pic } = this.props.user;
        var defaultImage = staticValues.images.defaultProfileImage;
        profile_pic = profile_pic ? profile_pic : defaultImage;

        return (
            <div className="bcomments-inp-div">
                <div className="bcomments-lbtn-container">
                    <i
                        className={
                            "material-icons bcomments-lbtn-icon" +
                            (liked ? " bcomments-lbtn-liked" : "")
                        }
                        onClick={this.onLike}
                    >
                        thumb_up
                    </i>
                    <p className="bcomments-lbtn-text">
                        {liked ? "You liked this post" : "Like this post"}
                    </p>
                </div>
                <div className="bcomments-inp-container">
                    <img className="bcomments-img" src={profile_pic} alt="" />
                    <div className="bcomments-inp-btn">
                        <textarea
                            className="bcomments-inp"
                            placeholder="Comment"
                        ></textarea>
                        <button
                            className="bcomments-btn"
                            disabled={this.state.loading}
                            onClick={this.onPost}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    renderComment = (data, i) => {
        var defaultImage = staticValues.images.defaultProfileImage;
        var { username, profile_pic, name } = data.user_info;
        var { text, time } = data;

        profile_pic = profile_pic ? profile_pic : defaultImage;
        time = formatDate(time);

        return (
            <div className="pcomment-container" key={i}>
                <img className="pcomment-img" src={profile_pic} alt="" />
                <div className="pcomment-nametext">
                    <Link to={`/user/${username}`} className="pcomment-name">
                        {name}
                    </Link>
                    <p className="pcomment-time">{time}</p>
                    <p className="pcomment-text">{text}</p>
                </div>
            </div>
        );
    };

    render() {
        const { comments } = this.state;

        return (
            <div className="bcomments-div">
                {this.renderInputs()}
                {comments === "pending" ? null : comments.length > 0 ? (
                    comments.map((data, i) => this.renderComment(data, i))
                ) : (
                    <p className="bcomments-nc-text">No comments</p>
                )}
            </div>
        );
    }
}

export default BlogComments;
