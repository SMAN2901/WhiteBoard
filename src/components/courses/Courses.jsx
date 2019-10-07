import React, { Component } from "react";
import Course from "../course/Course";
import { getCourses } from "../../api/CoursesApi";
import "./Courses.css";

class Courses extends Component {
    state = {
        courses: []
    };

    async componentDidMount() {
        const courses = await getCourses();
        this.setState({ courses });
    }

    async componentDidUpdate() {
        const courses = await getCourses();
        this.setState({ courses });
    }

    render() {
        return (
            <div className="courses">
                {this.state.courses.map(item => (
                    <Course key={item.course_id} data={item} />
                ))}
            </div>
        );
    }
}

export default Courses;
