import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import HashTag from "../hashtag/HashTag";
import { formatDate } from "../../services/util";
import staticValues from "../../staticValues.json";
import "./Blog.css";

class Blog extends Component {
    state = {
        blog: "pending"
    };

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        const { blog } = this.props;
        if (this._isMounted) this.setState({ blog });
    }

    componentDidUpdate() {
        const { blog } = this.props;
        if (this._isMounted && blog !== this.state.blog) {
            this.setState({ blog });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { blog } = this.state;
        const { defaultBlogBanner } = staticValues.images;

        return blog === "pending" ? null : blog ? (
            <div className="blogpost-container">
                <div className="blogpost-banner-container">
                    <img
                        src={blog.banner ? blog.banner : defaultBlogBanner}
                        alt=""
                        className="blogpost-banner"
                    ></img>
                </div>
                <div className="blogpost-info-container">
                    <p className="blogpost-title">{blog.title}</p>
                    <Link
                        to={`/user/${blog.author_info.username}`}
                        className="blogpost-author-name"
                    >
                        {blog.author_info.name}
                    </Link>
                    <p className="blogpost-date">
                        {formatDate(blog.date_created)}
                    </p>
                    <p className="blogpost-description">{blog.description}</p>
                    {blog.tags.map(tag => (
                        <HashTag
                            {...this.props}
                            key={tag}
                            tag={tag}
                            link={false}
                        />
                    ))}
                    <br></br>
                    <div className="blogpost-like">
                        <i className="material-icons blogpost-like-icon">
                            thumb_up
                        </i>
                        <span className="blogpost-like-text">{blog.likes}</span>
                    </div>
                    <div className="blogpost-comment">
                        <i className="material-icons blogpost-comment-icon">
                            chat
                        </i>
                        <span className="blogpost-comment-text">
                            {blog.comments}
                        </span>
                    </div>
                    <div className="blogpost-view">
                        <i className="material-icons blogpost-view-icon">
                            remove_red_eye
                        </i>
                        <span className="blogpost-view-text">{blog.views}</span>
                    </div>
                </div>
            </div>
        ) : (
            <Redirect to="/blog" />
        );
    }
}

export default Blog;
