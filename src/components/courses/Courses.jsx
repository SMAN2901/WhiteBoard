import React, { Component } from "react";
import Course from "../course/Course";
import { getCourses, getCreatedCourses } from "../../api/CoursesApi";
import "./Courses.css";

class Courses extends Component {
    _isMounted = false;

    state = {
        courses: "pending"
    };

    async componentDidMount() {
        this._isMounted = true;
        const { loadbar, queryType } = this.props;
        loadbar.start();
        var courses = "pending";

        if (this._isMounted) {
            if (queryType === "created")
                courses = await getCreatedCourses(this.props.user);
            else courses = await getCourses();

            if (courses !== "pending") {
                if (this._isMounted) this.setState({ courses });
                loadbar.stop();
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    render() {
        const { courses } = this.state;

        return courses === "pending" ? null : (
            <div className="courses">
                {this.state.courses.map(item => (
                    <Course key={item.course_id} {...this.props} data={item} />
                ))}
            </div>
        );
    }
}

export default Courses;
