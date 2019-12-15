import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../api/AuthApi";
import staticValues from "../../staticValues.json";
import "./Navbar.css";

class Navbar extends Component {
    render() {
        const { user } = this.props;

        const loginLink = (
            <React.Fragment>
                <Link className="navbar-login" to="/login">
                    Log in
                </Link>
                <Link className="navbar-signup" to="/signup">
                    Sign up
                </Link>
            </React.Fragment>
        );

        const logoutLink = user ? (
            <Link
                to=""
                onClick={() => {
                    logout();
                    window.location = "/";
                }}
            >
                <i className="material-icons logout-icon">power_settings_new</i>
            </Link>
        ) : null;

        const profileLink = user ? (
            <Link className="navbar-profile" to={"/user/" + user.username}>
                {user ? `${user.first_name} ${user.last_name}` : ""}
            </Link>
        ) : null;

        const profileImage = user ? (
            <Link to={"/user/" + user.username}>
                <img
                    className="nav-profile-img"
                    src={
                        user
                            ? user.profile_pic
                                ? user.profile_pic
                                : staticValues.images.defaultProfileImage
                            : staticValues.images.defaultProfileImage
                    }
                    alt=""
                ></img>
            </Link>
        ) : null;

        return (
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link className="navbar-logo-text" to="/">
                        WhiteBoard
                    </Link>
                </div>
                <div className="navbar-user">
                    {user === "pending" ? null : user ? (
                        <React.Fragment>
                            {profileImage}
                            {profileLink}
                            {logoutLink}
                        </React.Fragment>
                    ) : (
                        loginLink
                    )}
                </div>
            </div>
        );
    }
}

export default Navbar;
