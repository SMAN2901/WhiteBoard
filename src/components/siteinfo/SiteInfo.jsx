import React, { Component } from "react";
import { getSiteInfo } from "../../api/SiteApi";
import "./SiteInfo.css";

class SiteInfo extends Component {
    state = {
        data: "pending"
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        const data = await getSiteInfo();
        if (this._isMounted) this.setState({ data });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    formatNumber = n => {
        var s = "00" + n.toString();
        return s.slice(-3);
    };

    render() {
        const { data } = this.state;
        return data === "pending" || data === null ? null : (
            <div className="sinfo-container">
                <div className="sinfo-div sinfo-div-user">
                    <i className="material-icons sinfo-icon">
                        sentiment_very_satisfied
                    </i>
                    <span className="sinfo-num">
                        {this.formatNumber(data.total_user)}
                    </span>
                    <span className="sinfo-text">Users</span>
                </div>
                <div className="sinfo-div sinfo-div-course">
                    <i className="material-icons sinfo-icon">shop</i>
                    <span className="sinfo-num">
                        {this.formatNumber(data.total_course)}
                    </span>
                    <span className="sinfo-text">Courses</span>
                </div>
                <div className="sinfo-div sinfo-div-enrollment">
                    <i className="material-icons sinfo-icon">how_to_reg</i>
                    <span className="sinfo-num">
                        {this.formatNumber(data.total_enrollment)}
                    </span>
                    <span className="sinfo-text">Enrollments</span>
                </div>
            </div>
        );
    }
}

export default SiteInfo;
