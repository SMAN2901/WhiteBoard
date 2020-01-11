import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import CourseInfo from "../courseinfo/CourseInfo";
import CourseBanner from "../coursebanner/CourseBanner";
import CourseContents from "../coursecontents/CourseContents";
import CourseReview from "../coursereview/CourseReview";
import { getCourse, getLatestCourse } from "../../api/CoursesApi";
import "./CoursePage.css";

class CoursePage extends Component {
    state = {
        course: "pending",
        needUpdate: false
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        window.scrollTo(0, 0);
        this.props.loadbar.stop();
        const { loadbar, popup } = this.props;
        const id = this.props.match.params.id;

        loadbar.start();
        try {
            const course =
                id === "latest" ? await getLatestCourse() : await getCourse(id);
            if (this._isMounted) {
                loadbar.stop();
                this.setState({ course });
            }
        } catch (ex) {
            if (this._isMounted) {
                loadbar.stop();
                this.setState({ course: null });
                if (ex.response && ex.response.status === 404) {
                    popup.show("error", "404", "Not found");
                } else popup.show("error", "Error", "Something went wrong");
            }
        }
    }

    async componentDidUpdate() {
        if (!this.state.needUpdate) return;

        const id = this.props.match.params.id;
        var needUpdate = false;

        try {
            const course =
                id === "latest" ? await getLatestCourse() : await getCourse(id);
            if (this._isMounted) {
                this.setState({ course, needUpdate });
            }
        } catch (ex) {
            if (this._isMounted) {
                this.setState({ course: null, needUpdate });
            }
        }
    }

    setUpdateTrigger = () => {
        if (this._isMounted) {
            this.setState({ needUpdate: true });
        }
    };

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    render() {
        const { course } = this.state;

        return course === "pending" ? null : course ? (
            <div className="coursedetails-container">
                <CourseBanner banner={course.banner} />
                <div className="coursedetails-div">
                    <CourseInfo {...this.props} course={course} />
                    <CourseContents
                        {...this.props}
                        author={course.author}
                        editOption
                    />
                </div>
                <CourseReview
                    {...this.props}
                    course={course}
                    setUpdTrigger={this.setUpdateTrigger}
                />
            </div>
        ) : (
            <Redirect to="/" />
        );
    }
}

export default CoursePage;
