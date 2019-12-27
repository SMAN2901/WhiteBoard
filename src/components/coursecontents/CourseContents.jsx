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
        var contents =
            "contents" in this.props ? this.props.contents : "pending";
        const { id } = match.params;

        if (!("contents" in this.props)) {
            try {
                loadbar.start();
                contents = await getContents(id);
                if (contents !== "pending" && this._isMounted) {
                    this.setState({ contents });
                    loadbar.stop();
                }
            } catch (ex) {
                this.setState({ contents: [] });
                loadbar.stop();
                popup.show("error", "Error", "Something went wrong");
            }
        }
    }

    async componentDidUpdate() {
        const { match } = this.props;
        var contents = "pending";
        const { id } = match.params;

        try {
            if ("contents" in this.props) contents = this.props.contents;
            else contents = await getContents(id);

            if (contents !== "pending") {
                if (contents !== this.state.contents && this._isMounted) {
                    this.setState({ contents });
                }
            }
        } catch (ex) {}
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    contentElement = (type, content) => {
        const { content_id, course_id, title, has_completed } = content;

        var icon = "play_arrow";
        var classes = "coursedetails-content";

        if (type === "locked") classes += " content-locked";
        else if (type === "file") classes += " content-file";

        if (has_completed) icon = "done_all";
        if (type === "file") icon = "notes";

        return (
            <Link to={`/content/${course_id}/${content_id}`} key={content_id}>
                <div className={classes}>
                    <div className="coursedetails-content-icon-container">
                        <i className="material-icons coursedetails-content-icon">
                            {icon}
                        </i>
                    </div>
                    <label className="coursedetails-content-title">
                        {title}
                    </label>
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
        const contents =
            this.state.contents === "pending"
                ? this.state.contents
                : this.fixPlacement(this.state.contents);

        return contents === "pending" ? null : (
            <div className="coursedetails-contents-container">
                {contents.map(content => this.renderContent(content))}
            </div>
        );
    }
}

export default CourseContents;
