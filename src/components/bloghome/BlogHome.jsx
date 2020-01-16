import React, { Component } from "react";
import Blogs from "../blogs/Blogs";
import UserBlogs from "../userblogs/UserBlogs";
import { getPosts, getUserPosts } from "../../api/BlogApi";
import { getCurrentUser } from "../../api/AuthApi";
import "./BlogHome.css";

class BlogHome extends Component {
    state = {
        blogs: "pending",
        userblogs: "pending"
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        window.scroll(0, 0);
        const { loadbar, home, match } = this.props;
        const user = getCurrentUser();
        const id = user ? user.username : null;
        var uid = home ? "" : match.params.id;

        if (typeof uid === "undefined") uid = user.username;

        loadbar.start();
        try {
            const [blogs, userblogs] = await Promise.all([
                home ? getPosts() : getUserPosts(uid),
                getUserPosts(id)
            ]);
            loadbar.stop();
            if (this._isMounted) this.setState({ blogs, userblogs });
        } catch (ex) {
            loadbar.stop();
            if (this._isMounted) this.setState({ blogs: [], userblogs: [] });
        }
    }

    async componentDidUpdate(props) {
        if (props.home !== this.props.home) {
            const { loadbar, home, match } = this.props;
            const user = getCurrentUser();
            var uid = home ? "" : match.params.id;

            if (typeof uid === "undefined") uid = user.username;

            loadbar.start();
            try {
                const blogs = home ? await getPosts() : await getUserPosts(uid);
                if (this._isMounted) this.setState({ blogs });
                loadbar.stop();
            } catch (ex) {
                if (this._isMounted) {
                    this.setState({ blogs: [] });
                    loadbar.stop();
                }
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { blogs, userblogs } = this.state;

        return (
            <div className="bloghome-container">
                <Blogs {...this.props} blogs={blogs} />
                <UserBlogs {...this.props} blogs={userblogs} />
            </div>
        );
    }
}

export default BlogHome;
