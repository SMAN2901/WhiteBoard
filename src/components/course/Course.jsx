import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Course.css";

class Course extends Component {
    _isMounted = false;

    state = {
        bannerUrl: "/assets/images/whiteboard_course.jpg"
    };

    componentDidMount() {
        this._isMounted = true;
        this.image = new Image();
        this.image.src = this.props.data.banner;
        this.image.onload = this.handleImageLoaded;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleImageLoaded = () => {
        const { banner } = this.props.data;
        if (this._isMounted) this.setState({ bannerUrl: banner });
    };

    render() {
        const { course_id, title, author, tags, rating, fee } = this.props.data;
        const bannerStyle = {
            backgroundImage: `url(${this.state.bannerUrl})`
        };

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
                    <Link
                        className="course-title-link"
                        to={`/course/${course_id}`}
                    >
                        <p className="course-title">{title}</p>
                    </Link>
                    <Link
                        className="course-author-link"
                        to={`/user/${author.username}`}
                    >
                        <p className="course-author">{author.name}</p>
                    </Link>
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
