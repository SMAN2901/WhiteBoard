import React, { Component } from "react";
import "./HashTag.css";

class HashTag extends Component {
    render() {
        const { tag } = this.props;
        return (
            <span key={tag} className="hashtag">
                {tag}
            </span>
        );
    }
}

export default HashTag;
