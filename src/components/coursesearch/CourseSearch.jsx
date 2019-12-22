import React, { Component } from "react";
import Course from "../course/Course";
import { searchCourses } from "../../api/CoursesApi";
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
        const { match } = this.props;
        const { searchString } = match.params;

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

        return `Search results for "${searchString}"`;
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
