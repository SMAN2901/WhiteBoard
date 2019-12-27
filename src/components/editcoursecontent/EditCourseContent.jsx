import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import CourseBanner from "../coursebanner/CourseBanner";
import CourseContents from "../coursecontents/CourseContents";
import ContentAddForm from "../form/contentaddform/ContentAddForm";
import { getCourse } from "../../api/CoursesApi";
import "./EditCourseContent.css";

class EditCourseContent extends Component {
    state = {
        course: "pending",
        loading: false
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        window.scrollTo(0, 0);

        const { loadbar, popup } = this.props;
        const id = this.props.match.params.id;

        loadbar.start();
        try {
            var course = "pending";
            course = await getCourse(id);

            if (course !== "pending") {
                loadbar.stop();
                if (this._isMounted) this.setState({ course });
            }
        } catch (ex) {
            loadbar.stop();
            if (this._isMounted) this.setState({ course: null });
            if (ex.response && ex.response.status === 404) {
                popup.show("error", "404", "Not found");
            } else popup.show("error", "Error", "Something went wrong");
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    setLoading = (v = true) => {
        if (this._isMounted) this.setState({ loading: v });
    };

    render() {
        const { user } = this.props;
        const { course, loading } = this.state;

        return course === "pending" || user === "pending" ? null : course ===
              null || user === null ? (
            <Redirect to="/" />
        ) : (
            <div className="course-conupd-container">
                <CourseBanner banner={course.banner} />
                <div className="course-conupd-div">
                    <div className="course-conupd-forms-div">
                        <Link
                            className="course-conupd-title"
                            to={`/course/${course.course_id}`}
                        >
                            {course.title}
                        </Link>
                        <ContentAddForm
                            {...this.props}
                            type={true}
                            loading={loading}
                            setLoading={this.setLoading}
                        />
                        <ContentAddForm
                            {...this.props}
                            type={false}
                            loading={loading}
                            setLoading={this.setLoading}
                        />
                    </div>
                    <CourseContents {...this.props} />
                </div>
            </div>
        );
    }
}

export default EditCourseContent;
