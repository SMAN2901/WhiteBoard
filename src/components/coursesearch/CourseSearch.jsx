import React, { Component } from "react";
import Course from "../course/Course";
import { searchCourses } from "../../api/CoursesApi";
import staticValues from "../../staticValues.json";
import $ from "jquery";
import "./CourseSearch.css";

class CourseSearch extends Component {
    _isMounted = false;

    state = {
        courses: "pending",
        pagination: {
            itemPerPage: 12,
            totalPage: 0,
            currentPage: 1
        }
    };

    async componentDidMount() {
        this._isMounted = true;
        const { match, queryType } = this.props;
        var searchString = match.params.searchString.trim();

        if (queryType === "category") {
            var a = staticValues.courseCategories.filter(item => {
                return item.name === searchString;
            });
            searchString = a.length > 0 ? a[0].tags : "";
        }

        if (searchString.trim().length > 0) {
            await this.makeQuery(searchString.trim());
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    getPaginationValues = totalItem => {
        const { itemPerPage, currentPage } = this.state.pagination;
        var totalPage = Math.floor(totalItem / itemPerPage);

        if (totalPage * itemPerPage < totalItem) {
            totalPage = totalPage + 1;
        }

        return { itemPerPage, totalPage, currentPage };
    };

    makeQuery = async searchString => {
        if (this._isMounted) {
            this.props.loadbar.start();
            var courses = "pending";
            courses = await searchCourses(searchString);

            if (courses !== "pending") {
                if (this._isMounted) {
                    const pagination = this.getPaginationValues(courses.length);
                    this.setState({ courses, pagination });
                    this.props.loadbar.stop();

                    $("html, body").animate(
                        {
                            scrollTop:
                                $(".coursesearch-header-container").offset()
                                    .top - 80
                        },
                        700
                    );
                }
            }
        }
    };

    getHeader = () => {
        const { courses } = this.state;
        const { searchString } = this.props.match.params;

        if (courses === "pending") return "";
        if (courses.length < 1) return "No such course found.";

        var headerText = `Search results for "${searchString}"`;

        if (this.props.queryType === "category") {
            headerText = `Courses related to "${searchString}"`;
        }

        return headerText;
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

        var inpClass = ".coursesearch-pagination-inp";
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
        const { courses } = this.state;
        if (courses === "pending") return [];

        var { itemPerPage, currentPage } = this.state.pagination;
        var start = itemPerPage * (currentPage - 1);
        var end = Math.min(courses.length - 1, start + itemPerPage - 1);

        for (var i = start; i <= end; i++) {
            a.push(courses[i]);
        }

        return a;
    };

    onKeyUp = e => {
        var inpClass = ".coursesearch-pagination-inp";
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
            <div className="coursesearch-pagination-container">
                <i
                    className="material-icons coursesearch-pagination-icon"
                    onClick={this.paginateLeft}
                >
                    keyboard_arrow_left
                </i>
                <span className="coursesearch-pagination-number">{`${currentPage} / ${totalPage}`}</span>
                <i
                    className="material-icons coursesearch-pagination-icon"
                    onClick={this.paginateRight}
                >
                    keyboard_arrow_right
                </i>
                <input
                    type="text"
                    className="coursesearch-pagination-inp"
                    onKeyUp={this.onKeyUp}
                ></input>
                <button
                    className="coursesearch-pagination-btn"
                    onClick={this.paginateTo}
                >
                    Go
                </button>
            </div>
        ) : null;
    };

    render() {
        const courses = this.getCurrentItems();

        return courses === "pending" ? null : (
            <React.Fragment>
                <div className="coursesearch-header-container">
                    <p className="coursesearch-header-text">
                        {this.getHeader()}
                    </p>
                </div>
                <div className={"coursesearch-container"}>
                    {courses.map(item => (
                        <Course
                            key={item.course_id}
                            {...this.props}
                            data={item}
                        />
                    ))}
                </div>
                {this.renderPagination()}
            </React.Fragment>
        );
    }
}

export default CourseSearch;
