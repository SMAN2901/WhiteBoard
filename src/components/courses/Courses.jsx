import React, { Component } from "react";
import SiteBanner from "../sitebanner/SiteBanner";
import Course from "../course/Course";
import { getCourses } from "../../api/CoursesApi";
import "./Courses.css";

class Courses extends Component {
    _isMounted = false;

    state = {
        courses: "pending"
    };

    async componentDidMount() {
        this._isMounted = true;
        const { loadbar } = this.props;
        loadbar.start();
        const courses = await getCourses();
        if (courses !== "pending") {
            if (this._isMounted) this.setState({ courses });
            loadbar.stop();
        }
    }

    async componentDidUpdate() {
        //const courses = await getCourses();
        //if (this._isMounted) this.setState({ courses });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { courses } = this.state;

        const coursesComp =
            courses === "pending" ? null : (
                <div className="courses">
                    {this.state.courses.map(item => (
                        <Course key={item.course_id} data={item} />
                    ))}
                </div>
            );

        return (
            <React.Fragment>
                <SiteBanner />
                {coursesComp}
            </React.Fragment>
        );
    }
}

export default Courses;
