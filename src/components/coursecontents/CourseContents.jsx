import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getContents } from "../../api/CoursesApi";
import "./CourseContents.css";

class CourseContents extends Component {
    state = {
        contents: "pending"
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        const { loadbar, popup, match } = this.props;
        const { id } = match.params;

        if ("contents" in this.props) {
            if (this.props.contents !== "pending" && this._isMounted) {
                this.setState({ contents: this.props.contents });
            }
        } else {
            try {
                loadbar.start();

                var contents = [];
                if (id !== "latest") contents = await getContents(id);
                loadbar.stop();

                if (this._isMounted) {
                    this.setState({ contents });
                }
            } catch (ex) {
                this.setState({ contents: [] });
                loadbar.stop();
                popup.show("error", "Error", "Something went wrong");
            }
        }
    }

    componentDidUpdate() {
        if ("contents" in this.props) {
            const { contents } = this.props;

            if (
                contents !== "pending" &&
                contents !== this.state.contents &&
                this._isMounted
            ) {
                this.setState({ contents });
            }
        }
    }

    cutTitle = title => {
        const maxWordLen = 24;
        const indicator = "...";

        var rem = maxWordLen + 1;
        var newTitle = "";
        var words = title.split(" ").filter(s => s !== "");
        var i = 0;

        while (i < words.length) {
            if (rem < words[i].length + 1) break;
            newTitle = newTitle.concat(words[i] + " ");
            rem -= words[i].length + 1;
            rem += i % 2;
            i++;
        }

        rem = maxWordLen;

        while (i < words.length) {
            if (rem < words[i].length + 1) {
                var s = words[i].substring(0, rem) + indicator;
                newTitle = newTitle.concat(s);
                break;
            }
            newTitle = newTitle.concat(words[i] + " ");
            rem -= words[i].length + 1;
            rem += i % 2;
            i++;
        }

        return newTitle;
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    contentElement = (type, content) => {
        var { content_id, course_id, title, has_completed, file } = content;

        var icon = "play_arrow";
        var classes = "coursedetails-content";

        if (has_completed) icon = "done_all";
        if (type === "file") {
            icon = "notes";
            classes += " content-file";
        }
        if (file === "" || file === null) {
            icon = "lock";
            if (type !== "file") classes += " content-locked";
        }

        return (
            <Link
                className="coursedetails-content-link"
                to={`/content/${course_id}/${content_id}`}
                key={content_id}
            >
                <div className={classes}>
                    <i className="material-icons coursedetails-content-icon">
                        {icon}
                    </i>
                    <p className="coursedetails-content-title">
                        {this.cutTitle(title)}
                    </p>
                </div>
            </Link>
        );
    };

    renderContent = content => {
        var type = "normal";

        if (content.serial === -1) type = "file";

        return this.contentElement(type, content);
    };

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

    render() {
        const { user, author } = this.props;
        const { id } = this.props.match.params;
        const contents =
            this.state.contents === "pending"
                ? this.state.contents
                : this.fixPlacement(this.state.contents);

        return (
            <div className="coursedetails-contents-container">
                {user !== "pending" &&
                user !== null &&
                this.props.hasOwnProperty("editOption") &&
                user.id === author.id ? (
                    <div className="coursedetails-contents-edit-cont">
                        <Link
                            className="coursedetails-contents-edit-link"
                            to={`/update/course/${id}`}
                        >
                            <i className="material-icons coursedetails-contents-edit-icon">
                                edit
                            </i>
                            <p className="coursedetails-contents-edit-text">
                                Edit Contents
                            </p>
                        </Link>
                    </div>
                ) : null}
                {contents === "pending"
                    ? null
                    : contents.map(content => this.renderContent(content))}
            </div>
        );
    }
}

export default CourseContents;
