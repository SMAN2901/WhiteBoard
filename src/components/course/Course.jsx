import React, { Component } from "react";
import "./Course.css";

class Course extends Component {
    render() {
        const { title, author, tags, rating, fee, banner } = this.props.data;
        const bannerStyle = { backgroundImage: `url(${banner})` };
        return (
            <div className="course-container">
                <div className="course-value">
                    <p className="course-rating">
                        {rating.toFixed(1)}{" "}
                        <i className="fas fa-star icon-star"></i>
                    </p>
                    <p className="course-fee">{fee.toFixed(2)}$</p>
                </div>
                <div className="course-banner" style={bannerStyle}></div>
                <div className="course-info">
                    <p className="course-title">{title}</p>
                    <p className="course-author">{author}</p>
                    {tags.map(tag => (
                        <p key={tag} className="course-tags">
                            {tag}
                        </p>
                    ))}
                </div>
            </div>
        );
    }
}

export default Course;
