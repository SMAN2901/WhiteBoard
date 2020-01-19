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
                className="navbar-logout-link"
            >
                <i className="material-icons logout-icon">power_settings_new</i>
            </Link>
        ) : null;

        const notificationLink = user ? (
            <Link to="" className="counter-parent noti-icon-parent">
                <i className="material-icons noti-icon">notifications</i>
                <span className="counter-span"></span>
            </Link>
        ) : null;

        const messageLink = user ? (
            <Link to="" className="counter-parent msg-icon-parent">
                <i className="material-icons msg-icon">mail</i>
                <span className="counter-span"></span>
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
            <React.Fragment>
                <div className="navbar-container">
                    <div className="navbar-left-container">
                        <div className="navbar-left-inner">
                            <div className="navbar-logo">
                                <Link className="navbar-logo-text" to="/">
                                    WhiteBoard
                                </Link>
                            </div>
                            <Link className="navbar-blog-link" to="/blog">
                                <i className="material-icons navbar-blog-link-icon">
                                    subject
                                </i>
                                <span className="navbar-blog-link-text">
                                    Blogs
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="navbar-user">
                        {user === "pending" ? null : user ? (
                            <React.Fragment>
                                {profileImage}
                                {profileLink}
                                {notificationLink}
                                {messageLink}
                                {logoutLink}
                            </React.Fragment>
                        ) : (
                            loginLink
                        )}
                    </div>
                </div>
                <div
                    className="navbarx-container"
                    style={{
                        marginTop:
                            user === "pending" || user === null ? "0px" : "50px"
                    }}
                >
                    <Link className="navbarx-link" to="/blog">
                        <i className="material-icons navbarx-link-icon">
                            subject
                        </i>
                        <span className="navbarx-link-text">Blogs</span>
                    </Link>
                    <Link className="navbarx-link counter-parent" to="">
                        <i className="material-icons navbarx-link-icon">
                            notifications
                        </i>
                        <span className="navbarx-link-text">Notifications</span>
                        <span className="counter-spanx"></span>
                    </Link>
                    <Link className="navbarx-link counter-parent" to="">
                        <i className="material-icons navbarx-link-icon">mail</i>
                        <span className="navbarx-link-text">Messages</span>
                        <span className="counter-spanx"></span>
                    </Link>
                    <Link
                        className="navbarx-link navbarx-logout-link"
                        onClick={() => {
                            logout();
                            window.location = "/";
                        }}
                        to=""
                    >
                        <i className="material-icons navbarx-link-icon">
                            power_settings_new
                        </i>
                        <span className="navbarx-link-text">Log out</span>
                    </Link>
                </div>
            </React.Fragment>
        );
    }
}

export default Navbar;
