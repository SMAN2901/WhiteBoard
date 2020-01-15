import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./BlogLink.css";

class BlogLink extends Component {
    render() {
        return (
            <Link to="/blog">
                <div className="bloglink-container">
                    <p className="bloglink-text bloglink-text-1">
                        WhiteBoard Blog
                    </p>
                    <p className="bloglink-text bloglink-text-2">
                        Know others thoughts, share yours!
                    </p>
                </div>
            </Link>
        );
    }
}

export default BlogLink;
