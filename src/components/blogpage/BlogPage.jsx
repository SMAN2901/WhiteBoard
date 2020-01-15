import React, { Component } from "react";
import { Link } from "react-router-dom";
import Blog from "../blog/Blog";
import UserBlogs from "../userblogs/UserBlogs";
import BlogComments from "../blogcomments/BlogComments";
import { getPost, getUserPosts } from "../../api/BlogApi";
import { getCurrentUser } from "../../api/AuthApi";
import "./BlogPage.css";

class BlogPage extends Component {
    state = {
        blogs: "pending",
        blog: "pending",
        needUpdate: false
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        window.scroll(0, 0);
        const { loadbar, match } = this.props;
        const { id } = match.params;
        const user = getCurrentUser();
        const username = user ? user.username : null;

        loadbar.start();
        try {
            const [blog, blogs] = await Promise.all([
                getPost(id),
                getUserPosts(username)
            ]);
            loadbar.stop();
            if (this._isMounted) this.setState({ blogs, blog });
        } catch (ex) {
            loadbar.stop();
            if (this._isMounted) this.setState({ blogs: [], blog: null });
        }
    }

    async componentDidUpdate() {
        const { id } = this.props.match.params;

        if (this.state.needUpdate) {
            try {
                const blog = await getPost(id);
                if (this._isMounted) {
                    this.setState({ blog, needUpdate: false });
                }
            } catch (ex) {
                if (this._isMounted) this.setState({ needUpdate: false });
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setUpdateTrigger = () => {
        this.setState({ needUpdate: true });
    };

    render() {
        const { blogs, blog } = this.state;
        const liked = blog === "pending" ? false : blog.is_liked;

        return (
            <div className="blogpage-container">
                <div className="blogpage-left-container">
                    <Link to="/blog" className="blogpage-toplink">
                        <i className="material-icons blogpage-toplink-icon">
                            menu_open
                        </i>
                        <p className="blogpage-toplink-text">
                            View Recent Blogs
                        </p>
                    </Link>
                    <Blog {...this.props} blog={blog} />
                    <BlogComments
                        {...this.props}
                        setUpdateTrigger={this.setUpdateTrigger}
                        liked={liked}
                    />
                </div>
                <UserBlogs {...this.props} blogs={blogs} />
            </div>
        );
    }
}

export default BlogPage;
