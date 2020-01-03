import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import CourseBanner from "../coursebanner/CourseBanner";
import CourseContents from "../coursecontents/CourseContents";
import ContentAddForm from "../form/contentaddform/ContentAddForm";
import PrerequisiteForm from "../form/prerequisiteform/PrerequisiteForm";
import PreviewForm from "../form/previewform/PreviewForm";
import { getCourse, getContents } from "../../api/CoursesApi";
import "./EditCourseContent.css";

class EditCourseContent extends Component {
    state = {
        course: "pending",
        contents: "pending",
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
            var contents = "pending";
            course = await getCourse(id);
            contents = await getContents(id);

            if (course !== "pending" && contents !== "pending") {
                loadbar.stop();
                contents = this.fixPlacement(contents);
                if (this._isMounted) this.setState({ course, contents });
            }
        } catch (ex) {
            loadbar.stop();
            if (this._isMounted) {
                this.setState({
                    course: null,
                    contents: null
                });
            }
            if (ex.response && ex.response.status === 404) {
                popup.show("error", "404", "Not found");
            } else popup.show("error", "Error", "Something went wrong");
        }
    }

    async componentDidUpdate() {
        var contents = "pending";
        const id = this.props.match.params.id;
        contents = await getContents(id);

        if (contents !== "pending" && contents !== this.state.contents) {
            contents = this.fixPlacement(contents);
            if (this._isMounted) {
                this.setState({ contents });
            }
        }
    }

    fixPlacement = contents => {
        var a = [];
        var len = contents.length;

        for (var i = 0; i < len; i++) {
            if (contents[0].serial === -1) {
                a.push(contents.shift());
            } else break;
        }

        for (i = 0; i < a.length; i++) {
            contents.push(a[i]);
        }

        return contents;
    };

    filterContents = () => {
        var a = [];
        const { contents } = this.state;

        if (contents !== "pending") {
            for (var i = 0; i < contents.length; i++) {
                if (contents[i].serial !== -1) {
                    a.push(contents[i]);
                }
            }
        }

        return a;
    };

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
        const contents = this.filterContents();

        return course === "pending" ||
            user === "pending" ||
            contents === "pending" ? null : course === null ||
          user === null ||
          contents === null ? (
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
                        {contents.length > 0 ? (
                            <React.Fragment key={contents}>
                                <PrerequisiteForm
                                    {...this.props}
                                    loading={loading}
                                    setLoading={this.setLoading}
                                    contents={contents}
                                />
                                <PreviewForm
                                    {...this.props}
                                    loading={loading}
                                    setLoading={this.setLoading}
                                    contents={contents}
                                />
                            </React.Fragment>
                        ) : null}
                    </div>
                    <CourseContents {...this.props} />
                </div>
            </div>
        );
    }
}

export default EditCourseContent;
