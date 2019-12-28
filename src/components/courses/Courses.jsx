import React, { Component } from "react";
import Course from "../course/Course";
import {
    getCourses,
    getCreatedCourses,
    getTopRatedCourses,
    getNewCourses,
    getFreeCourses
} from "../../api/CoursesApi";
import $ from "jquery";
import "./Courses.css";

class Courses extends Component {
    _isMounted = false;

    state = {
        courses: "pending"
    };

    icons = {
        created: "person_pin",
        toprated: "bar_chart",
        new: "new_releases",
        free: "card_giftcard",
        all: "menu_book"
    };

    animation = {
        transitionLength: 270
    };

    async componentDidMount() {
        this._isMounted = true;
        const { loadbar, queryType } = this.props;
        var courses = "pending";

        if (this._isMounted) {
            loadbar.start();
            if (queryType === "created")
                courses = await getCreatedCourses(this.props.user);
            else if (queryType === "toprated")
                courses = await getTopRatedCourses();
            else if (queryType === "new") courses = await getNewCourses();
            else if (queryType === "free") courses = await getFreeCourses();
            else courses = await getCourses();

            if (courses !== "pending") {
                if (this._isMounted) {
                    this.setState({ courses });
                    loadbar.stop();
                }
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    clickRight = () => {
        const classes = ".courses-" + this.props.queryType;
        const move = this.animation.transitionLength;
        const scrollValue = "+=" + move.toString();
        $(classes).animate({ scrollLeft: scrollValue }, 500, "swing");
    };

    clickLeft = () => {
        const classes = ".courses-" + this.props.queryType;
        const move = this.animation.transitionLength;
        const scrollValue = "-=" + move.toString();
        $(classes).animate({ scrollLeft: scrollValue }, 500, "swing");
    };

    expandToggle = () => {
        const { queryType } = this.props;
        const contclass = ".courses-" + queryType;
        const textClass = ".courselist-expand-container-" + queryType;

        $(contclass).slideToggle();
        $(textClass).slideToggle();
    };

    getFocus = () => {
        const className = ".courses-" + this.props.queryType;
        const move = $(className).offset().top - 130;
        const display = $(className).css("display");

        if (display !== "none") {
            $("html,body").animate({ scrollTop: move }, 1000, () => {
                $(className).focus();
            });
        }
    };

    render() {
        const { courses } = this.state;
        const { label, queryType } = this.props;
        const icon = this.icons[queryType];

        return courses === "pending" ? null : (
            <React.Fragment>
                <div
                    className="courselist-header-container"
                    onClick={this.getFocus}
                >
                    <div
                        className="courselist-label-container"
                        onClick={this.expandToggle}
                    >
                        <i className="material-icons courselist-label-icon">
                            {icon}
                        </i>
                        <label className="courselist-label-text">{label}</label>
                    </div>
                    <div className="courselist-scroller-container">
                        <i
                            className="material-icons courselist-scroller-icon courselist-scroller-left"
                            onClick={this.clickLeft}
                        >
                            keyboard_arrow_left
                        </i>
                        <i
                            className="material-icons courselist-scroller-icon courselist-scroller-right"
                            onClick={this.clickRight}
                        >
                            keyboard_arrow_right
                        </i>
                    </div>
                </div>
                <div className={`courses courses-${queryType}`} tabIndex="-1">
                    <div
                        className={`courselist-container courselist-container-${queryType}`}
                    >
                        {this.state.courses.map(item => (
                            <Course
                                key={item.course_id}
                                {...this.props}
                                data={item}
                            />
                        ))}
                    </div>
                </div>
                <div
                    className={`courselist-expand-container courselist-expand-container-${queryType}`}
                    onClick={this.expandToggle}
                >
                    <i className="material-icons courselist-expand-icon">
                        arrow_right
                    </i>
                    <label className="courselist-expand-text">
                        Click here to see
                    </label>
                </div>
            </React.Fragment>
        );
    }
}

export default Courses;
