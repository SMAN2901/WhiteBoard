import React, { Component } from "react";
import Course from "../course/Course";
import {
    getCourses,
    getCreatedCourses,
    getTopRatedCourses,
    getNewCourses
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
        all: "menu_book"
    };

    animation = {
        transitionLength: 300
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

    getPixelValue = (className, prop) => {
        const str = $(className).css(prop);
        const len = str.length;
        const s = str.substring(0, len - 2);
        return parseInt(s);
    };

    clickRight = () => {
        const className = ".courselist-container-" + this.props.queryType;
        const width = this.getPixelValue(".courses", "width");
        const len = this.getPixelValue(className, "width");
        const left = this.getPixelValue(className, "left");
        const minLeft = width - len;
        const move = this.animation.transitionLength;
        const newLeft = Math.max(minLeft, left - move);
        const value = newLeft.toString() + "px";

        if (len > width) {
            $(className).animate({ left: value }, 400);
        }
    };

    clickLeft = () => {
        const className = ".courselist-container-" + this.props.queryType;
        const width = this.getPixelValue(".courses", "width");
        const len = this.getPixelValue(className, "width");
        const left = this.getPixelValue(className, "left");
        const move = this.animation.transitionLength;
        const newLeft = Math.min(0, left + move);
        const value = newLeft.toString() + "px";

        if (len > width) {
            $(className).animate({ left: value }, 400);
        }
    };

    render() {
        const { courses } = this.state;
        const { label, queryType } = this.props;
        const icon = this.icons[queryType];

        return courses === "pending" ? null : (
            <div className="courses">
                <div className="courselist-header-container">
                    <div className="courselist-label-container">
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
        );
    }
}

export default Courses;
