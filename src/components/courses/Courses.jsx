import React, { Component } from "react";
import Course from "../course/Course";
import {
    getEnrolledCourses,
    getCreatedCourses,
    getBestsellerCourses,
    getTopRatedCourses,
    getNewCourses,
    getFreeCourses,
    getCourses
} from "../../api/CoursesApi";
import $ from "jquery";
import "./Courses.css";

class Courses extends Component {
    _isMounted = false;

    state = {
        courses: "pending"
    };

    icons = {
        bestseller: "shop",
        created: "person_pin",
        toprated: "bar_chart",
        new: "new_releases",
        free: "card_giftcard",
        enrolled: "how_to_reg"
    };

    animation = {
        transitionLength: 270,
        lastTime: {
            click: -1,
            focus: -1
        }
    };

    async componentDidMount() {
        this._isMounted = true;
        const { loadbar, queryType, storeCourses, user } = this.props;
        const username =
            user === "pending" || user === null ? null : user.username;
        var courses = "pending";

        if (
            this.props.courses[queryType] === "pending" ||
            ((queryType === "created" || queryType === "enrolled") &&
                this.props.id !== username)
        ) {
            if (this._isMounted) {
                loadbar.start();
                if (queryType === "created")
                    courses = await getCreatedCourses(this.props.id);
                else if (queryType === "enrolled")
                    courses = await getEnrolledCourses(this.props.id);
                else if (queryType === "bestseller")
                    courses = await getBestsellerCourses();
                else if (queryType === "toprated")
                    courses = await getTopRatedCourses();
                else if (queryType === "new") courses = await getNewCourses();
                else if (queryType === "free") courses = await getFreeCourses();
                else courses = await getCourses();

                if (courses !== "pending") {
                    if (this._isMounted) {
                        this.setState({ courses });

                        if (
                            queryType === "created" ||
                            queryType === "enrolled"
                        ) {
                            if (this.props.id === username) {
                                storeCourses(queryType, courses);
                            }
                        } else storeCourses(queryType, courses);

                        loadbar.stop();
                    }
                }
            }
        } else {
            if (this._isMounted) {
                courses = this.props.courses[queryType];
                this.setState({ courses });
            }
        }
    }

    async componentDidUpdate(props) {
        const { queryType, loadbar } = this.props;

        if (queryType === "created" || queryType === "enrolled") {
            const { user, id } = this.props;
            const username =
                user === "pending" || user === null ? null : user.username;

            if (id !== username && id !== props.id) {
                var courses;
                loadbar.start();
                if (queryType === "created")
                    courses = await getCreatedCourses(this.props.id);
                else if (queryType === "enrolled")
                    courses = await getEnrolledCourses(this.props.id);
                loadbar.stop();

                if (this._isMounted) {
                    this.setState({ courses });
                }
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    shouldAnimate = (type, delta) => {
        const currentTime = Date.now();
        const lastTime = this.animation.lastTime[type];

        if (lastTime === -1 || currentTime - lastTime > delta) {
            this.animation.lastTime[type] = currentTime;
            return true;
        }
        return false;
    };

    clickRight = () => {
        if (this.shouldAnimate("click", 500)) {
            const classes = ".courses-" + this.props.queryType;
            const display = $(classes)
                .parent()
                .css("display");

            if (display !== "none") {
                const move = this.animation.transitionLength;
                const scrollValue = "+=" + move.toString();
                $(classes).animate({ scrollLeft: scrollValue }, 500, "swing");
            }
        }
    };

    clickLeft = () => {
        if (this.shouldAnimate("click", 500)) {
            const classes = ".courses-" + this.props.queryType;
            const display = $(classes)
                .parent()
                .css("display");

            if (display !== "none") {
                const move = this.animation.transitionLength;
                const scrollValue = "-=" + move.toString();
                $(classes).animate({ scrollLeft: scrollValue }, 500, "swing");
            }
        }
    };

    expandToggle = () => {
        const { queryType } = this.props;
        const contclass = ".courses-" + queryType;
        const textClass = ".courselist-expand-container-" + queryType;

        $(contclass)
            .parent()
            .slideToggle();
        $(textClass).slideToggle();
    };

    getFocus = () => {
        if (this.shouldAnimate("focus", 1000)) {
            const className = ".courses-" + this.props.queryType;
            const move = $(className).offset().top - 130;
            const display = $(className)
                .parent()
                .css("display");

            if (display !== "none") {
                $("html,body").animate({ scrollTop: move }, 1000, () => {
                    $(className).focus();
                });
            }
        }
    };

    render() {
        const { courses } = this.state;
        const { label, queryType } = this.props;
        const icon = this.icons[queryType];

        return courses === "pending" || courses.length < 1 ? null : (
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
                <div className="courses-scroller-hider">
                    <div
                        className={`courses courses-${queryType}`}
                        tabIndex="-1"
                    >
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
