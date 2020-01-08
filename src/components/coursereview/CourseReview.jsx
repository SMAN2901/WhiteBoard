import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    getCourseReview,
    reviewCourse,
    rateCourse
} from "../../api/CoursesApi";
import staticValues from "../../staticValues.json";
import $ from "jquery";
import "./CourseReview.css";

class CourseReview extends Component {
    state = {
        star: null,
        reviews: [],
        loading: false,
        lastUpdated: -1,
        updateDelay: 3000
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        const { course_id } = this.props.course;
        const txtClass = ".coursereview-loading-text";

        $(txtClass).text("Loading reviews...");
        const reviews = await getCourseReview(course_id);

        if (this._isMounted) {
            this.setState({ reviews });
            $(txtClass).text("");
        }
    }

    shouldUpdate = () => {
        var currentTime = Date.now();
        var { lastUpdated, updateDelay } = this.state;

        if (lastUpdated === -1 || currentTime - lastUpdated > updateDelay) {
            lastUpdated = currentTime;
            if (this._isMounted) this.setState({ lastUpdated });
            return true;
        }

        return false;
    };

    async componentDidUpdate() {
        if (!this.shouldUpdate()) return;

        const { course_id } = this.props.course;

        const reviews = await getCourseReview(course_id);

        if (this._isMounted && reviews !== this.state.reviews) {
            this.setState({ reviews });
        }
    }

    onSubmit = async e => {
        e.preventDefault();

        const { star } = this.state;
        const { popup } = this.props;
        const { course_id } = this.props.course;
        const inpClass = ".coursereview-inp";
        const btnClass = ".coursereview-save-btn";
        const review = $(inpClass)
            .val()
            .trim();

        if (this._isMounted) this.setState({ loading: true });
        $(btnClass).text("Saving...");

        try {
            if (star && review !== null && review.length > 0) {
                await Promise.all([
                    rateCourse(course_id, { value: star }),
                    reviewCourse(course_id, { review })
                ]);
            } else if (star) await rateCourse(course_id, { value: star });
            else if (review !== null && review.length > 0) {
                await reviewCourse(course_id, { review });
            }
            $(btnClass).text("Save");
            $(inpClass).val("");
            if (this._isMounted) {
                this.setState({ star: null, loading: false });
                this.onStarLeave();
            }
        } catch (ex) {
            $(btnClass).text("Save");
            $(inpClass).val("");
            popup.show("error", "Error", "Something went wrong");
            if (this._isMounted) {
                this.setState({ star: null, loading: false });
                this.onStarLeave();
            }
        }
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    onStarHover = e => {
        const id = $(e.target).attr("id");
        const x = parseInt(id[id.length - 1]);

        for (var i = 1; i <= 5; i++) {
            const hid = "#coursereview-star-" + i.toString();
            const icon = i > x ? "star_border" : "star";
            $(hid).text(icon);
        }
    };

    onStarLeave = () => {
        const x = this.state.star ? this.state.star : 0;
        for (var i = 1; i <= 5; i++) {
            const hid = "#coursereview-star-" + i.toString();
            const icon = i > x ? "star_border" : "star";
            $(hid).text(icon);
        }
    };

    onStarClick = e => {
        const id = $(e.target).attr("id");
        const x = parseInt(id[id.length - 1]);
        if (this._isMounted) this.setState({ star: x });
    };

    getStars = n => {
        if (n > 5) n = 5;
        var a = [
            "star_border",
            "star_border",
            "star_border",
            "star_border",
            "star_border"
        ];

        for (var i = 0; i < n; i++) a[i] = "star";

        return a;
    };

    reviewElement = data => {
        var defaultImage = staticValues.images.defaultProfileImage;
        var { username, profile_pic, name } = data.user;
        var { review, rating } = data;

        profile_pic = profile_pic ? profile_pic : defaultImage;

        return (
            <div className="coursereview-container" key={username}>
                <img className="coursereview-img" src={profile_pic} alt="" />
                <div className="coursereview-nametext">
                    <Link to={`/user/${username}`}>
                        <p className="coursereview-name">{name}</p>
                    </Link>
                    <p className="coursereview-text">{review}</p>
                    <div className="coursereview-rating">
                        {this.getStars(Math.floor(rating)).map(
                            (icon, index) => (
                                <i
                                    className="material-icons coursereview-rating-icon"
                                    key={index}
                                >
                                    {icon}
                                </i>
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        var a = [1, 2, 3, 4, 5];
        const { reviews } = this.state;
        const defaultImage = staticValues.images.defaultProfileImage;
        const { user, course } = this.props;
        const profile_pic =
            user !== "pending" && user !== null
                ? user.profile_pic
                    ? user.profile_pic
                    : defaultImage
                : defaultImage;

        return (
            <div className="coursereview-div">
                <p className="coursereview-header">Reviews</p>
                {user === "pending" ||
                user === null ||
                course.author.id === user.id ||
                !course.enrolled ? null : (
                    <div className="coursereview-container">
                        <img
                            className="coursereview-img"
                            src={profile_pic}
                            alt=""
                        />
                        <div className="coursereview-inp-container">
                            <textarea
                                className="coursereview-inp"
                                placeholder="Review"
                            ></textarea>
                            <p className="coursereview-rate-text">
                                Rate this course
                            </p>
                            <div className="coursereview-star-container">
                                {a.map(i => (
                                    <i
                                        key={i}
                                        className="material-icons coursereview-star"
                                        id={`coursereview-star-${i.toString()}`}
                                        onMouseOver={this.onStarHover}
                                        onMouseLeave={this.onStarLeave}
                                        onClick={this.onStarClick}
                                    >
                                        star_border
                                    </i>
                                ))}
                            </div>
                            <button
                                className="coursereview-save-btn"
                                disabled={this.state.loading}
                                onClick={this.onSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
                <p className="coursereview-loading-text"></p>
                {reviews.map(review => this.reviewElement(review))}
            </div>
        );
    }
}

export default CourseReview;
