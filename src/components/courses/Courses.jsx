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
    /*
    touches = {
        swap: false,
        posX: null
    };

    getPixelValue = (className, prop) => {
        const str = $(className).css(prop);
        const len = str.length;
        const s = str.substring(0, len - 2);
        return parseInt(s);
    };

    moveLeft = trans => {
        const className = ".courselist-container-" + this.props.queryType;
        const width = this.getPixelValue(".courses", "width");
        const len = this.getPixelValue(className, "width");
        const left = this.getPixelValue(className, "left");
        const minLeft = width - len;
        const move = Math.floor(trans);
        const newLeft = Math.max(minLeft, left - move);
        const value = newLeft.toString() + "px";

        if (len > width) {
            $(className).css("left", value);
        }
    };

    moveRight = trans => {
        const className = ".courselist-container-" + this.props.queryType;
        const width = this.getPixelValue(".courses", "width");
        const len = this.getPixelValue(className, "width");
        const left = this.getPixelValue(className, "left");
        const move = Math.floor(trans);
        const newLeft = Math.min(0, left + move);
        const value = newLeft.toString() + "px";

        if (len > width) {
            $(className).css("left", value);
        }
    };

    onMouseDown = e => {
        e.persist();
        this.touches.swap = true;
    };

    onMouseMove = e => {
        e.persist();
        const { swap, posX } = this.touches;
        if (swap) {
            const { pageX } = e;
            if (posX) {
                if (pageX > posX) this.moveRight(pageX - posX);
                else if (pageX < posX) this.moveLeft(posX - pageX);
            }
            this.touches.posX = pageX;
        }
    };

    onMouseUp = e => {
        e.persist();
        this.touches.swap = false;
        this.touches.posX = null;
    };

    onTouchStart = e => {
        e.persist();
        this.touches.swap = true;
    };

    onTouchMove = e => {
        e.persist();
        const { swap, posX } = this.touches;
        if (swap) {
            const { pageX } = e.touches[0];
            if (posX) {
                if (pageX > posX) this.moveRight(pageX - posX);
                else if (pageX < posX) this.moveLeft(posX - pageX);
            }
            this.touches.posX = pageX;
        }
    };

    onTouchEnd = e => {
        e.persist();
        this.touches.swap = false;
        this.touches.posX = null;
    };*/

    render() {
        const { courses } = this.state;
        const { label, queryType } = this.props;
        const icon = this.icons[queryType];

        return courses === "pending" ? null : (
            <React.Fragment>
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
                <div className={`courses courses-${queryType}`}>
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
            </React.Fragment>
        );
    }
}

export default Courses;
