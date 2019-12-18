import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
        const { user, loadbar, popup } = this.props;

        try {
            if (user !== "pending") {
                loadbar.start();
                courses = await getCreatedCourses(user.id);
            }
            if (courses !== "pending") {
                loadbar.stop();
                this.setState({ courses });
            }
        } catch (ex) {
            loadbar.stop();
            popup.show("error", "Error", "something went wrong");
        }
    }

    selectCourse = index => {
        this.setState({ index });
    };

    render() {
        const { courses, index } = this.state;
        const { loadbar, popup, user } = this.props;

        return user === "pending" ||
            courses === "pending" ? null : courses.length > 0 ? (
            <div className="edit-course-div">
                <EditCourseSelect
                    loadbar={loadbar}
                    popup={popup}
                    courses={courses}
                    onSelect={this.selectCourse}
                />
                <div className="edit-course-form-div" key={index}>
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
