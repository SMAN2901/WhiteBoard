import React, { Component } from "react";
import "./Profile.css";

class Profile extends Component {
    render() {
        const { user } = this.props;
        return (
            <div className="profile-info">
                <div className="profile-img-container">
                    <div className="profile-img-outer"></div>
                    <div className="profile-img-inner"></div>
                    <img
                        className="profile-img"
                        src={user ? user.profile_pic : ""}
                        alt=""
                    ></img>
                </div>
                <br></br>
                <span className="profile-name">
                    {user ? `${user.first_name} ${user.last_name}` : ""}
                </span>
                <br></br>
                <span className="profile-email">{user ? user.email : ""}</span>
            </div>
        );
    }
}

export default Profile;
