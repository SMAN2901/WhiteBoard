import React, { Component } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../services/util";
import staticValues from "../../staticValues.json";
import $ from "jquery";
import "./Blogs.css";

class Blogs extends Component {
    state = {
        blogs: [],
        pagination: {
            itemPerPage: 5,
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

        var inpClass = ".blogs-pagination-inp";
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
        var inpClass = ".blogs-pagination-inp";
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
            <div className="blogs-pagination-container">
                <i
                    className="material-icons blogs-pagination-icon"
                    onClick={this.paginateLeft}
                >
                    keyboard_arrow_left
                </i>
                <span className="blogs-pagination-number">{`${currentPage} / ${totalPage}`}</span>
                <i
                    className="material-icons blogs-pagination-icon"
                    onClick={this.paginateRight}
                >
                    keyboard_arrow_right
                </i>
                <input
                    type="text"
                    className="blogs-pagination-inp"
                    onKeyUp={this.onKeyUp}
                ></input>
                <button
                    className="blogs-pagination-btn"
                    onClick={this.paginateTo}
                >
                    Go
                </button>
            </div>
        ) : null;
    };

    onClick = id => {
        const { history } = this.props;
        history.push("/blog/post/" + id);
    };

    renderBlog = blog => {
        var {
            id,
            title,
            author_info,
            date_created,
            banner,
            description,
            likes,
            views,
            comments
        } = blog;

        date_created = formatDate(date_created);
        var desc = description.substring(0, 450);

        if (description.length < 450) desc += "...";
        if (banner === null) banner = staticValues.images.defaultBlogBanner;

        return (
            <div
                className="minblog-container"
                key={id}
                onClick={() => this.onClick(id)}
            >
                <div className="minblog-banner-container">
                    <img src={banner} alt="" className="minblog-banner"></img>
                </div>
                <div className="minblog-info-container">
                    <p className="minblog-title">{title}</p>
                    <Link
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        to={`/user/${author_info.username}`}
                        className="minblog-author-name"
                    >
                        {author_info.name}
                    </Link>
                    <p className="minblog-date">{date_created}</p>
                    <p className="minblog-description">{desc}</p>
                    <div className="minblog-like">
                        <i className="material-icons minblog-like-icon">
                            thumb_up
                        </i>
                        <span className="minblog-like-text">{likes}</span>
                    </div>
                    <div className="minblog-comment">
                        <i className="material-icons minblog-comment-icon">
                            chat
                        </i>
                        <span className="minblog-comment-text">{comments}</span>
                    </div>
                    <div className="minblog-view">
                        <i className="material-icons minblog-view-icon">
                            remove_red_eye
                        </i>
                        <span className="minblog-view-text">{views}</span>
                    </div>
                </div>
            </div>
        );
    };

    renderNameHeader = user => {
        return (
            <div className="blogs-nh">
                <p className="blogs-nh-text blogs-nh-text1">Recent blogs by</p>
                <Link to={`/user/${user.username}`}>
                    <p className="blogs-nh-text blogs-nh-text2">{user.name}</p>
                </Link>
            </div>
        );
    };

    render() {
        var { blogs } = this.state;
        var header = "Recent Blogs";

        if (blogs === "pending") header = "";
        else if (blogs.length < 1) header = "No Recent Blogs";
        blogs = this.getCurrentItems();

        return (
            <div className="blogs-container">
                {!this.props.home && blogs.length > 0 ? (
                    this.renderNameHeader(blogs[0].author_info)
                ) : (
                    <p className="blogs-header">{header}</p>
                )}
                {blogs.map(blog => this.renderBlog(blog))}
                {this.renderPagination()}
            </div>
        );
    }
}

export default Blogs;
