import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./ContentView.css";

class ContentView extends Component {
    render() {
        const { goToNext, goToPrev } = this.props;
        const { file, title, description, serial } = this.props.content;

        return (
            <div className="conv-container">
                {serial !== -1 ? (
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
                ) : null}
                <p className="conv-title">{title}</p>
                <p className="conv-description">{description}</p>
                <div className="conv-icon-container">
                    <a href={file} className="conv-link" download>
                        <i className="material-icons conv-icon conv-icon-download">
                            save_alt
                        </i>
                    </a>
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
            </div>
        );
    }
}

export default ContentView;
