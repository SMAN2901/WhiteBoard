import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import CourseInfo from "../courseinfo/CourseInfo";
import CourseContents from "../coursecontents/CourseContents";
import CourseReview from "../coursereview/CourseReview";
import { getCourse, getLatestCourse } from "../../api/CoursesApi";
import staticValues from "../../staticValues.json";
import "./CoursePage.css";

class CoursePage extends Component {
    state = {
        course: "pending"
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        window.scrollTo(0, 0);
        const { loadbar, popup } = this.props;
        const id = this.props.match.params.id;

        if (this._isMounted) {
            loadbar.start();
            try {
                const course =
                    id === "latest"
                        ? await getLatestCourse()
                        : await getCourse(id);
                if (course !== "pending") {
                    loadbar.stop();
                    this.setState({ course });
                }
            } catch (ex) {
                loadbar.stop();
                this.setState({ course: null });
                if (ex.response && ex.response.status === 404) {
                    popup.show("error", "404", "Not found");
                } else popup.show("error", "Error", "Something went wrong");
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    render() {
        const { course } = this.state;
        const defaultBanner = staticValues.images.defaultCourseBanner;

        return course === "pending" ? null : course ? (
            <div className="coursedetails-container">
                <div className="coursedetails-banner-container">
                    <img
                        className="coursedetails-banner"
                        src={course.banner ? course.banner : defaultBanner}
                        alt=""
                    />
                </div>
                <div className="coursedetails-div">
                    <CourseInfo {...this.props} course={course} />
                    <CourseContents {...this.props} />
                </div>
                <CourseReview {...this.props} />
            </div>
        ) : (
            <Redirect to="/" />
        );
    }
}

export default CoursePage;
