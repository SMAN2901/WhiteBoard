import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CourseInfo.css";

class CourseInfo extends Component {
    render() {
        const { course } = this.props;
        const defaultImage = "/assets/images/profile_pic.png";
        const image = course.author.profile_pic
            ? course.author.profile_pic
            : defaultImage;

        return (
            <div className="coursedetails-info-container">
                <p className="coursedetails-title">{course.title}</p>
                <p className="coursedetails-author">
                    <img
                        className="coursedetails-author-img"
                        src={image}
                        alt=""
                    />
                    <Link
                        className="coursedetails-author-name"
                        to={`/user/${course.author.username}`}
                    >
                        {course.author.name}
                    </Link>
                </p>
                <br></br>
                <Link to="" className="coursedetails-enroll">
                    Enroll Now
                </Link>
                <div className="coursedetails-separator"></div>
                <p className="coursedetails-fee">
                    <i className="material-icons coursedetails-fee-icon">
                        payment
                    </i>
                    {course.fee.toFixed(2)} $
                </p>
                <p className="coursedetails-rating">
                    <i className="material-icons coursedetails-rating-icon">
                        bar_chart
                    </i>
                    {course.rating.toFixed(2)} $
                </p>
                <p className="coursedetails-language">
                    <i className="material-icons coursedetails-language-icon">
                        language
                    </i>
                    Language: English
                </p>
                <p className="coursedetails-length">
                    <i className="material-icons coursedetails-length-icon">
                        access_time
                    </i>
                    Length: 18 Hours
                </p>
                <p className="coursedetails-difficulty">
                    <i className="material-icons coursedetails-difficulty-icon">
                        widgets
                    </i>
                    Difficulty: Advanced
                </p>
                <br></br>
                <p className="coursedetails-outline-header">Course Outline</p>
                <p className="coursedetails-outline">{course.outline}</p>
                <br></br>
                <p className="coursedetails-prerequisites-header">
                    Prerequisites
                </p>
                <p className="coursedetails-prerequisites">
                    {course.prerequisites}
                </p>
            </div>
        );
    }
}

export default CourseInfo;
