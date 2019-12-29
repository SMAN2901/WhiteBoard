import React, { Component } from "react";
import { Link } from "react-router-dom";
import HashTag from "../hashtag/HashTag";
import staticValues from "../../staticValues.json";
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
            course_id,
            title,
            fee,
            rating,
            outline,
            prerequisites,
            author,
            tags,
            language,
            length,
            difficulty
        } = this.props.course;
        const { user } = this.props;
        var defaultImage = staticValues.images.defaultProfileImage;
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
                {user.username === author.username ? (
                    <Link
                        to={`/edit/course/${course_id}`}
                        className="coursedetails-edit-link"
                    >
                        <div className="coursedetails-edit">
                            <i className="material-icons coursedetails-edit-icon">
                                edit
                            </i>
                            <span className="coursedetails-edit-text">
                                Edit
                            </span>
                        </div>
                    </Link>
                ) : (
                    <Link to="" className="coursedetails-enroll-link">
                        <div className="coursedetails-enroll">
                            <i className="material-icons coursedetails-enroll-icon">
                                how_to_reg
                            </i>
                            <span className="coursedetails-enroll-text">
                                Enroll
                            </span>
                        </div>
                    </Link>
                )}
                <div className="coursedetails-separator"></div>
                {this.courseValue("payment", "Fee", fee)}
                {this.courseValue("bar_chart", "Rating", rating)}
                {this.courseValue("language", "Language", language)}
                {this.courseValue("access_time", "Length", `${length} Hours`)}
                {this.courseValue("widgets", "Difficulty", difficulty)}
                <br></br>
                <p className="coursedetails-outline-header">Course Outline</p>
                <p className="coursedetails-outline">{outline}</p>
                <br></br>
                <p className="coursedetails-prerequisites-header">
                    Prerequisites
                </p>
                <p className="coursedetails-prerequisites">{prerequisites}</p>
                <br></br>
                {tags.map(tag => (
                    <HashTag {...this.props} key={tag} tag={tag} />
                ))}
            </div>
        );
    }
}

export default CourseInfo;
