import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import CourseBanner from "../coursebanner/CourseBanner";
import CourseContents from "../coursecontents/CourseContents";
import ContentView from "../contentview/ContentView";
import CourseReview from "../coursereview/CourseReview";
import { getCourse, getContents } from "../../api/CoursesApi";
import staticValues from "../../staticValues.json";
import "./ContentPage.css";

class ContentPage extends Component {
    state = {
        course: "pending",
        contents: "pending",
        loading: false,
        needUpdate: false
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        window.scrollTo(0, 0);

        const { loadbar, match } = this.props;
        const { course_id, content_id } = match.params;

        loadbar.start();

        var [course, contents] = await Promise.all([
            this.queryCourse(course_id),
            this.queryContents(course_id)
        ]);

        loadbar.stop();

        if (!this.findContent(contents, content_id)) {
            contents = null;
        }

        if (this._isMounted) {
            this.setState({ course, contents });
        }
    }

    async componentDidUpdate() {
        if (!this.state.needUpdate) return;

        const { course_id, content_id } = this.props.match.params;

        var [course, contents] = await Promise.all([
            this.queryCourse(course_id),
            this.queryContents(course_id)
        ]);

        if (this._isMounted) {
            if (!this.findContent(contents, content_id)) {
                contents = null;
            }
            var needUpdate = false;

            this.setState({ course, contents, needUpdate });
        }
    }

    setUpdateTrigger = () => {
        if (this._isMounted) {
            this.setState({ needUpdate: true });
        }
    };

    findContent = (contents, id) => {
        for (var i = 0; i < contents.length; i++) {
            if (contents[i].content_id === id) {
                return true;
            }
        }
        return false;
    };

    currentContent = () => {
        const { contents } = this.state;
        const { content_id } = this.props.match.params;

        for (var i = 0; i < contents.length; i++) {
            if (contents[i].content_id === content_id) {
                return contents[i];
            }
        }

        return null;
    };

    queryCourse = async id => {
        const { popup } = this.props;

        try {
            var course = "pending";
            course = await getCourse(id);
            return course;
        } catch (ex) {
            if (ex.response && ex.response.status === 404) {
                popup.show("error", "404", "Not found");
            } else popup.show("error", "Error", "Something went wrong");
            return null;
        }
    };

    queryContents = async id => {
        const { popup } = this.props;

        try {
            var contents = "pending";
            contents = await getContents(id);
            return contents;
        } catch (ex) {
            popup.show("error", "Error", "Something went wrong");
            return null;
        }
    };

    goToNext = () => {
        const { contents } = this.state;
        const { course_id, content_id } = this.props.match.params;

        for (var i = 0; i < contents.length; i++) {
            if (contents[i].content_id === content_id) {
                var j = i < contents.length - 1 ? i + 1 : 0;
                return `/content/${course_id}/${contents[j].content_id}`;
            }
        }
    };

    goToPrev = () => {
        const { contents } = this.state;
        const { course_id, content_id } = this.props.match.params;

        for (var i = 0; i < contents.length; i++) {
            if (contents[i].content_id === content_id) {
                var j = i > 0 ? i - 1 : contents.length - 1;
                return `/content/${course_id}/${contents[j].content_id}`;
            }
        }
    };

    getTitle = id => {
        const { contents } = this.state;

        for (var i = 0; i < contents.length; i++) {
            if (contents[i].content_id === id) {
                return contents[i].title;
            }
        }

        return "";
    };

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    render() {
        const { course, contents } = this.state;

        return course === "pending" ||
            contents === "pending" ? null : course === null ||
          contents === null ? (
            <Redirect to="/" />
        ) : (
            <div className="course-conpg-container">
                <CourseBanner banner={course.banner} />
                <div className="course-conpg-div">
                    <div className="course-conpg-content-div">
                        <Link
                            className="course-conpg-title"
                            to={`/course/${course.course_id}`}
                        >
                            {course.title}
                        </Link>
                        <div className="course-conpg-author">
                            <Link to={`/user/${course.author.username}`}>
                                <img
                                    className="course-conpg-author-img"
                                    src={
                                        course.author.profile_pic
                                            ? course.author.profile_pic
                                            : staticValues.images
                                                  .defaultProfileImage
                                    }
                                    alt=""
                                />
                            </Link>
                            <Link
                                to={`/user/${course.author.username}`}
                                className="course-conpg-author-name"
                            >
                                {course.author.name}
                            </Link>
                        </div>
                        <ContentView
                            {...this.props}
                            key={window.location.href}
                            content={this.currentContent()}
                            enrolled={course.enrolled}
                            goToNext={this.goToNext}
                            goToPrev={this.goToPrev}
                            getTitle={this.getTitle}
                            setUpdateTrigger={this.setUpdateTrigger}
                        />
                    </div>
                    <CourseContents
                        {...this.props}
                        author={course.author}
                        contents={contents}
                        editOption
                    />
                </div>
                <CourseReview
                    {...this.props}
                    course={course}
                    setUpdTrigger={this.setUpdateTrigger}
                />
            </div>
        );
    }
}

export default ContentPage;
