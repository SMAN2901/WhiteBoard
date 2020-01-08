import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { getCreatedCourses } from "../../api/CoursesApi";
import EditCourseSelect from "../editcourseselect/EditCourseSelect";
import CourseEditForm from "../form/courseeditform/CourseEditForm";
import CourseBannerEdit from "../coursebanneredit/CourseBannerEdit";
import "./EditCourse.css";

class EditCourse extends Component {
    state = {
        courses: "pending",
        index: 0
    };

    async componentDidMount() {
        window.scroll(0, 0);
        var courses = "pending";
        const { user, loadbar, popup, storeCourses } = this.props;

        if (this.props.courses.created === "pending") {
            try {
                if (user !== "pending") {
                    loadbar.start();
                    courses = await getCreatedCourses(user.id);
                }
                if (courses !== "pending") {
                    loadbar.stop();
                    this.setState({ courses });
                    var index = this.getInitialIndex();
                    this.selectCourse(index);
                    storeCourses("created", courses);
                }
            } catch (ex) {
                loadbar.stop();
                popup.show("error", "Error", "something went wrong");
            }
        } else {
            courses = this.props.courses.created;
            this.setState({ courses });
            var i = this.getInitialIndex(courses);
            this.selectCourse(i);
        }
    }

    getInitialIndex = (courses = null) => {
        const id = this.props.match.params.id;

        if (courses === null) courses = this.state.courses;

        for (var i = 0; i < courses.length; i++) {
            if (courses[i].course_id === id) {
                return i;
            }
        }
        return 0;
    };

    selectCourse = index => {
        this.setState({ index });
    };

    render() {
        const { courses, index } = this.state;
        const { loadbar, popup, user } = this.props;

        return user === "pending" ||
            courses === "pending" ? null : courses.length > 0 ? (
            <div className="edit-course-div" key={index}>
                <EditCourseSelect
                    loadbar={loadbar}
                    popup={popup}
                    courses={courses}
                    index={index}
                    onSelect={this.selectCourse}
                />
                <div className="edit-course-form-div">
                    <Link
                        className="edit-course-conupd-link"
                        to={`/update/course/${courses[index].course_id}`}
                    >
                        <i className="material-icons edit-course-conupd-icon">
                            edit
                        </i>
                        <span className="edit-course-conupd-text">
                            Edit Contents
                        </span>
                    </Link>
                    <CourseBannerEdit
                        loadbar={loadbar}
                        popup={popup}
                        course={courses[index]}
                    />
                    <CourseEditForm
                        loadbar={loadbar}
                        popup={popup}
                        course={courses[index]}
                    />
                </div>
            </div>
        ) : (
            <Redirect to="/" />
        );
    }
}

export default EditCourse;
