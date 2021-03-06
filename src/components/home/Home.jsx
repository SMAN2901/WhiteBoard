import React, { Component } from "react";
import SiteBanner from "../sitebanner/SiteBanner";
import Courses from "../courses/Courses";
import SiteInfo from "../siteinfo/SiteInfo";

class Home extends Component {
    componentDidMount() {
        window.scroll(0, 0);
    }

    render() {
        return (
            <React.Fragment>
                <SiteBanner {...this.props} />
                <Courses
                    {...this.props}
                    queryType="bestseller"
                    label="Bestseller"
                />
                <Courses
                    {...this.props}
                    queryType="toprated"
                    label="Top Rated"
                />
                <Courses {...this.props} queryType="new" label="Brand New" />
                <Courses
                    {...this.props}
                    queryType="free"
                    label="On the House"
                />
                <SiteInfo />
            </React.Fragment>
        );
    }
}

export default Home;
