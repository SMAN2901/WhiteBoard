import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import CourseInfo from "../courseinfo/CourseInfo";
import CourseContents from "../coursecontents/CourseContents";
import CourseReview from "../coursereview/CourseReview";
import { getCourse, getLatestCourse } from "../../api/CoursesApi";
import "./CoursePage.css";

class CoursePage extends Component {
    state = {
        course: "pending"
    };

    async componentDidMount() {
        const { loadbar, popup } = this.props;
        const id = this.props.match.params.id;
        loadbar.start();
        try {
            const course =
                id === "latest" ? await getLatestCourse() : await getCourse(id);
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

    async componentDidUpdate() {
        //const id = this.props.match.params.id;
        //const course = await getCourse(id);
        //this.setState({ course });
    }

    render() {
        const { course } = this.state;
        const defaultBanner = "/assets/images/whiteboard_course.jpg";

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
