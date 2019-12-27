import React, { Component } from "react";
import staticValues from "../../staticValues.json";
import "./CourseBanner.css";

class CourseBanner extends Component {
    render() {
        const { banner } = this.props;
        const { defaultCourseBanner } = staticValues.images;

        return (
            <div className="coursedetails-banner-container">
                <img
                    className="coursedetails-banner"
                    src={banner ? banner : defaultCourseBanner}
                    alt=""
                />
            </div>
        );
    }
}

export default CourseBanner;
