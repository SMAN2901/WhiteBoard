import React, { Component } from "react";
import SiteBanner from "../sitebanner/SiteBanner";
import Courses from "../courses/Courses";

class Home extends Component {
    componentWillUnmount() {
        window.scroll(0, 0);
    }

    render() {
        return (
            <React.Fragment>
                <SiteBanner />
                <Courses
                    {...this.props}
                    queryType="toprated"
                    label="Top Rated"
                />
                <Courses {...this.props} queryType="new" label="Brand New" />
            </React.Fragment>
        );
    }
}

export default Home;
