import React, { Component } from "react";
import UserBlogs from "../userblogs/UserBlogs";
import BlogPostForm from "../form/blogpostform/BlogPostForm";
import { getUserPosts } from "../../api/BlogApi";
import { getCurrentUser } from "../../api/AuthApi";
import "./BlogEntry.css";

class BlogEntry extends Component {
    state = {
        blogs: "pending",
        needUpdate: false
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        window.scroll(0, 0);
        const { loadbar } = this.props;
        const user = getCurrentUser();

        if (user) {
            try {
                loadbar.start();
                const id = user.username;
                const blogs = await getUserPosts(id);
                if (this._isMounted) this.setState({ blogs });
                loadbar.stop();
            } catch (ex) {
                if (this._isMounted) this.setState({ blogs: [] });
                loadbar.stop();
            }
        }
    }

    async componentDidUpdate() {
        const user = getCurrentUser();

        if (user && this.state.needUpdate) {
            try {
                const id = user.username;
                const blogs = await getUserPosts(id);
                if (this._isMounted) {
                    this.setState({ blogs, needUpdate: false });
                }
            } catch (ex) {}
        }
    }

    setUpdateTrigger = () => {
        this.setState({ needUpdate: true });
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { blogs } = this.state;

        return (
            <div className="blogentry-container">
                <BlogPostForm
                    {...this.props}
                    setUpdateTrigger={this.setUpdateTrigger}
                />
                <UserBlogs {...this.props} blogs={blogs} />
            </div>
        );
    }
}

export default BlogEntry;
