import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CourseInfo.css";

class CourseInfo extends Component {
    courseValue = (icon, name, value) => {
        return (
            <div className="coursedetails-value">
                <i className="material-icons coursedetails-value-icon">
                    {icon}
                </i>
                <p className="coursedetails-value-text">
                    {name}: {value}
                </p>
            </div>
        );
    };

    render() {
        var {
            title,
            fee,
            rating,
            outline,
            prerequisites,
            author
        } = this.props.course;
        var defaultImage = "/assets/images/profile_pic.png";
        var image = author.profile_pic ? author.profile_pic : defaultImage;
        fee = fee.toFixed(2).toString() + "$";
        rating = rating.toFixed(2);

        return (
            <div className="coursedetails-info-container">
                <p className="coursedetails-title">{title}</p>
                <p className="coursedetails-author">
                    <img
                        className="coursedetails-author-img"
                        src={image}
                        alt=""
                    />
                    <Link
                        className="coursedetails-author-name"
                        to={`/user/${author.username}`}
                    >
                        {author.name}
                    </Link>
                </p>
                <br></br>
                <Link to="" className="coursedetails-enroll">
                    Enroll Now
                </Link>
                <div className="coursedetails-separator"></div>
                {this.courseValue("payment", "Fee", fee)}
                {this.courseValue("bar_chart", "Rating", rating)}
                {this.courseValue("language", "Language", "English")}
                {this.courseValue("access_time", "Length", "18 Hours")}
                {this.courseValue("widgets", "Difficulty", "Advanced")}
                <br></br>
                <p className="coursedetails-outline-header">Course Outline</p>
                <p className="coursedetails-outline">{outline}</p>
                <br></br>
                <p className="coursedetails-prerequisites-header">
                    Prerequisites
                </p>
                <p className="coursedetails-prerequisites">{prerequisites}</p>
            </div>
        );
    }
}

export default CourseInfo;
