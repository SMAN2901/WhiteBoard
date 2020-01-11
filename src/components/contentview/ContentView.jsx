import React, { Component } from "react";
import { Link } from "react-router-dom";
import { contentCompleted } from "../../api/CoursesApi";
import "./ContentView.css";

class ContentView extends Component {
    async componentDidMount() {
        if (this.props.enrolled) {
            const { course_id, content_id } = this.props.match.params;
            await contentCompleted(course_id, { content_id });
            this.props.setUpdateTrigger();
        }
    }

    render() {
        const { goToNext, goToPrev, getTitle } = this.props;
        const {
            file,
            title,
            description,
            serial,
            course_id,
            prerequisites,
            access
        } = this.props.content;

        return (
            <div className="conv-container">
                {file !== null && file !== "" ? (
                    serial !== -1 ? (
                        <video
                            className="conv-video"
                            src={file}
                            width="100%"
                            height="auto"
                            controls
                            autoPlay
                        >
                            Your browser does not support the video
                        </video>
                    ) : null
                ) : (
                    <div className="conv-locked-container">
                        <i className="material-icons conv-locked-icon">lock</i>
                        <div className="conv-locked-text">
                            <p className="conv-locked-locked">Locked</p>
                            <p className="conv-locked-p">{access}</p>
                        </div>
                    </div>
                )}
                <p className="conv-title">{title}</p>
                <p className="conv-description">{description}</p>
                <div className="conv-icon-container">
                    {file !== null && file !== "" ? (
                        <a href={file} className="conv-link" download>
                            <i className="material-icons conv-icon conv-icon-download">
                                save_alt
                            </i>
                        </a>
                    ) : null}
                    <Link to={goToPrev()} className="conv-link">
                        <i className="material-icons conv-icon">
                            keyboard_arrow_left
                        </i>
                    </Link>
                    <Link to={goToNext()} className="conv-link">
                        <i className="material-icons conv-icon">
                            keyboard_arrow_right
                        </i>
                    </Link>
                </div>
                {prerequisites ? (
                    <React.Fragment>
                        <label className="conv-preq-label">Prerequisites</label>
                        <div className="conv-preq-container">
                            {prerequisites.map(id => (
                                <Link
                                    className="conv-preq"
                                    to={`/content/${course_id}/${id}`}
                                    key={id}
                                >
                                    <i className="material-icons conv-preq-icon">
                                        arrow_right
                                    </i>
                                    <p className="conv-preq-title">
                                        {getTitle(id)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </React.Fragment>
                ) : null}
            </div>
        );
    }
}

export default ContentView;
