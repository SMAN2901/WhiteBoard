import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./HashTag.css";

class HashTag extends Component {
    render() {
        const { tag, link } = this.props;
        const url = link ? `/search/course/${tag}` : window.location.pathname;

        return (
            <Link
                key={tag}
                to={url}
                className="hashtag"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                {tag}
            </Link>
        );
    }
}

export default HashTag;
