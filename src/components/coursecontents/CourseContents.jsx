import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CourseContents.css";

class CourseContents extends Component {
    contentElement = (type, completed) => {
        var icon = "play_arrow";
        var classes = "coursedetails-content";

        if (type === "locked") classes += " content-locked";
        else if (type === "file") classes += " content-file";

        if (completed) icon = "done_all";
        if (type === "file") icon = "notes";

        return (
            <Link to="">
                <div className={classes}>
                    <div className="coursedetails-content-icon-container">
                        <i className="material-icons coursedetails-content-icon">
                            {icon}
                        </i>
                    </div>
                    <label className="coursedetails-content-title">
                        {type === "file" ? "Files" : "Content Title"}
                    </label>
                </div>
            </Link>
        );
    };

    render() {
        return (
            <div className="coursedetails-contents-container">
                {this.contentElement("normal", true)}
                {this.contentElement("normal", false)}
                {this.contentElement("normal", false)}
                {this.contentElement("locked", false)}
                {this.contentElement("locked", false)}
                {this.contentElement("file", false)}
            </div>
        );
    }
}

export default CourseContents;
