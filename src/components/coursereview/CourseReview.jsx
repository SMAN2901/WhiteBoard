import React, { Component } from "react";
import { Link } from "react-router-dom";
import staticValues from "../../staticValues.json";
import "./CourseReview.css";

class CourseReview extends Component {
    fakeReviews = [
        {
            name: "Sadman Rizwan",
            username: "sadman",
            image:
                "https://98e20c85.ngrok.io/media/ProfilePic/sadman/boy-icon-png-10.jpg",
            text: "This is a great course. Learned a lot.",
            rating: 4.7
        },
        {
            name: "Minhajul Islam",
            username: "minhaj",
            image: null,
            text: "Mata gurtese amar",
            rating: 0.1
        },
        {
            name: "Mamu Ashrafuddola",
            username: "mamu",
            image: null,
            text:
                "Mamuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",
            rating: 3.8
        }
    ];

    reviewElement = review => {
        var ratingClass = "coursereview-rating";
        const defaultImage = staticValues.images.defaultProfileImage;
        var { name, username, image, text, rating } = review;

        image = image ? image : defaultImage;
        if (rating >= 4.5) ratingClass += " rating-high";
        if (rating < 3.0) ratingClass += " rating-low";

        return (
            <div className="coursereview-container" key={username}>
                <img className="coursereview-img" src={image} alt="" />
                <div className="coursereview-nametext">
                    <Link to={`/user/${username}`}>
                        <p className="coursereview-name">{name}</p>
                    </Link>
                    <p className="coursereview-text">{text}</p>
                    <p className={ratingClass}>Rating: {rating.toFixed(1)}</p>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="coursereview-div">
                <p className="coursereview-header">Reviews</p>
                {this.fakeReviews.map(review => this.reviewElement(review))}
            </div>
        );
    }
}

export default CourseReview;
