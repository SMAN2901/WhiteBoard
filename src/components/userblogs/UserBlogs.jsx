import React, { Component } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../services/util";
import { getCurrentUser } from "../../api/AuthApi";
import $ from "jquery";
import "./UserBlogs.css";

class UserBlogs extends Component {
    state = {
        blogs: [],
        pagination: {
            itemPerPage: 10,
            totalPage: 0,
            currentPage: 1
        }
    };

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        const { blogs } = this.props;
        const len = blogs === "pending" ? 0 : blogs.length;
        const pagination = this.getPaginationValues(len);
        if (this._isMounted) this.setState({ blogs, pagination });
    }

    componentDidUpdate() {
        const { blogs } = this.props;
        const len = blogs === "pending" ? 0 : blogs.length;
        const pagination = this.getPaginationValues(len);
        if (this._isMounted && blogs !== this.state.blogs) {
            this.setState({ blogs, pagination });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getPaginationValues = totalItem => {
        const { itemPerPage, currentPage } = this.state.pagination;
        var totalPage = Math.floor(totalItem / itemPerPage);

        if (totalPage * itemPerPage < totalItem) {
            totalPage = totalPage + 1;
        }

        return { itemPerPage, totalPage, currentPage };
    };

    paginateLeft = () => {
        var { itemPerPage, totalPage, currentPage } = this.state.pagination;

        if (totalPage > 1 && currentPage > 1) {
            currentPage = currentPage - 1;
            const pagination = { itemPerPage, totalPage, currentPage };
            this.setState({ pagination });
        }
    };

    paginateRight = () => {
        var { itemPerPage, totalPage, currentPage } = this.state.pagination;

        if (totalPage > 1 && currentPage < totalPage) {
            currentPage = currentPage + 1;
            const pagination = { itemPerPage, totalPage, currentPage };
            this.setState({ pagination });
        }
    };

    paginateTo = e => {
        e.preventDefault();
        this.onKeyUp();

        var inpClass = ".userblogs-pagination-inp";
        var currentPage = $(inpClass).val();
        var { itemPerPage, totalPage } = this.state.pagination;

        $(inpClass).val("");
        if (currentPage.length > 0) currentPage = parseInt(currentPage);
        else return;

        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPage) currentPage = totalPage;

        const pagination = { itemPerPage, totalPage, currentPage };
        this.setState({ pagination });
    };

    getCurrentItems = () => {
        var a = [];
        const { blogs } = this.state;
        var { itemPerPage, currentPage } = this.state.pagination;

        if (blogs === "pending") return [];
        if (blogs.length <= itemPerPage) return blogs;

        var start = itemPerPage * (currentPage - 1);
        var end = Math.min(blogs.length - 1, start + itemPerPage - 1);

        for (var i = start; i <= end; i++) {
            a.push(blogs[i]);
        }

        return a;
    };

    onKeyUp = e => {
        var inpClass = ".userblogs-pagination-inp";
        var s = $(inpClass).val();
        var val = "";

        if (e && e.keyCode === 13) {
            this.paginateTo(e);
        }

        for (var i = 0; i < s.length; i++) {
            if (!isNaN(parseInt(s[i]))) {
                val += s[i];
            }
        }

        $(inpClass).val(val);
    };

    renderPagination = () => {
        const { totalPage, currentPage } = this.state.pagination;

        return totalPage > 1 ? (
            <div className="userblogs-pagination-container">
                <i
                    className="material-icons userblogs-pagination-icon"
                    onClick={this.paginateLeft}
                >
                    keyboard_arrow_left
                </i>
                <span className="userblogs-pagination-number">{`${currentPage} / ${totalPage}`}</span>
                <i
                    className="material-icons userblogs-pagination-icon"
                    onClick={this.paginateRight}
                >
                    keyboard_arrow_right
                </i>
                <input
                    type="text"
                    className="userblogs-pagination-inp"
                    onKeyUp={this.onKeyUp}
                ></input>
                <button
                    className="userblogs-pagination-btn"
                    onClick={this.paginateTo}
                >
                    Go
                </button>
            </div>
        ) : null;
    };

    renderBlog = blog => {
        var { id, title, date_created, likes, views, comments } = blog;

        date_created = formatDate(date_created);

        return (
            <Link to={`/blog/post/${id}`} key={id}>
                <div className="userblog-container">
                    <p className="userblog-title">{title}</p>
                    <p className="userblog-date">{date_created}</p>
                    <div className="userblog-like">
                        <i className="material-icons userblog-like-icon">
                            thumb_up
                        </i>
                        <span className="userblog-like-text">{likes}</span>
                    </div>
                    <div className="userblog-comment">
                        <i className="material-icons userblog-comment-icon">
                            chat
                        </i>
                        <span className="userblog-comment-text">
                            {comments}
                        </span>
                    </div>
                    <div className="userblog-view">
                        <i className="material-icons userblog-view-icon">
                            remove_red_eye
                        </i>
                        <span className="userblog-view-text">{views}</span>
                    </div>
                </div>
            </Link>
        );
    };

    render() {
        var { blogs } = this.state;
        var header = "Recent blogs by you";
        const user = getCurrentUser();

        if (blogs === "pending") header = "";
        else if (blogs.length < 1) header = "You haven't written any blog yet";
        if (user === null) header = "Log in to see your posts";
        blogs = this.getCurrentItems();

        return (
            <div className="userblogs-container">
                <p className="userblogs-header">{header}</p>
                {user && this.props.blogs !== "pending" ? (
                    <Link className="userblogs-wlink" to="/blog/entry">
                        <i className="material-icons userblogs-wlink-icon">
                            edit
                        </i>
                        <p className="userblogs-wlink-text">Write Now</p>
                    </Link>
                ) : null}
                {blogs.map(blog => this.renderBlog(blog))}
                {this.renderPagination()}
            </div>
        );
    }
}

export default UserBlogs;
