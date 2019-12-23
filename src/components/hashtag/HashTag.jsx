import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./HashTag.css";

class HashTag extends Component {
    render() {
        const { tag } = this.props;

        return (
            <Link key={tag} to={`/search/course/${tag}`} className="hashtag">
                {tag}
            </Link>
        );
    }
}

export default HashTag;
