import React, { Component } from "react";
import createFragment from "react-addons-create-fragment";
import { Link } from "react-router-dom";
import { logout } from "../../api/AuthApi";
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
            <React.Fragment>
                <Link
                    to=""
                    onClick={() => {
                        logout();
                        window.location = "/";
                    }}
                >
                    <i className="material-icons logout-icon">
                        power_settings_new
                    </i>
                </Link>
                <Link
                    className="navbar-logout"
                    to=""
                    onClick={() => {
                        logout();
                        window.location = "/";
                    }}
                >
                    Log Out
                </Link>
            </React.Fragment>
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
                    src={user ? user.profile_pic : ""}
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
                    {user === "pending"
                        ? null
                        : user
                        ? createFragment({
                              profileImage: profileImage,
                              profileLink: profileLink,
                              logoutLink: logoutLink
                          })
                        : loginLink}
                </div>
            </div>
        );
    }
}

export default Navbar;
