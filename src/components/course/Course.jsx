import React, { Component } from "react";
import { Link } from "react-router-dom";
import HashTag from "../hashtag/HashTag";
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

        return (
            <div className="courses-container">
                <div
                    className="course-container"
                    onClick={() => {
                        this.props.history.push(`/course/${course_id}`);
                    }}
                >
                    <img
                        className="course-banner"
                        src={this.state.bannerUrl}
                        alt=""
                    />
                    <div className="course-badge">BESTSELLER</div>
                    <div className="course-values">
                        <div className="course-fee">{fee.toFixed(2)} $</div>
                        <div className="course-rating-icon">
                            <i className="material-icons rating-icon">
                                bar_chart
                            </i>
                        </div>
                        <div className="course-rating">{rating.toFixed(1)}</div>
                    </div>
                    <div className="course-info">
                        <Link
                            onClick={e => {
                                e.stopPropagation();
                            }}
                            className="course-title"
                            to={`/course/${course_id}`}
                        >
                            {title}
                        </Link>
                        <Link
                            onClick={e => {
                                e.stopPropagation();
                            }}
                            className="course-author"
                            to={`/user/${author.username}`}
                        >
                            {author.name}
                        </Link>
                        {tags.map(tag => (
                            <HashTag {...this.props} key={tag} tag={tag} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Course;
