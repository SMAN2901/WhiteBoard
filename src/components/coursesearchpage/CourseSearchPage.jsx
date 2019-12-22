import React, { Component } from "react";
import SiteBanner from "../sitebanner/SiteBanner";
import CourseSearch from "../coursesearch/CourseSearch";

class CourseSearchPage extends Component {
    render() {
        return (
            <React.Fragment>
                <SiteBanner {...this.props} />
                <CourseSearch {...this.props} key={window.location.href} />
            </React.Fragment>
        );
    }
}

export default CourseSearchPage;
