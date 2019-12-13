import React, { Component } from "react";
import SiteBanner from "../sitebanner/SiteBanner";
import Courses from "../courses/Courses";

class Home extends Component {
    render() {
        const { loadbar, popup } = this.props;
        return (
            <React.Fragment>
                <SiteBanner />
                <Courses
                    {...this.props}
                    loadbar={loadbar}
                    popup={popup}
                    queryType="all"
                />
            </React.Fragment>
        );
    }
}

export default Home;
