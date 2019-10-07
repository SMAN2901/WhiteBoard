import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

class Navbar extends Component {
    render() {
        const { user } = this.props;

        const loginLink = (
            <React.Fragment>
                <Link className="navbar-login" to="/login">
                    Log in
                </Link>
                <span className="navbar-span">or</span>
                <Link className="navbar-signup" to="/signup">
                    Sign up
                </Link>
            </React.Fragment>
        );

        const profileLink = user ? (
            <Link className="navbar-profile" to={"/" + user.username}>
                {user ? `${user.first_name} ${user.last_name}` : ""}
            </Link>
        ) : null;

        const profileImage = user ? (
            <img
                className="nav-profile-img"
                src={user ? user.profile_pic : ""}
                alt=""
            ></img>
        ) : null;

        return (
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link className="navbar-logo-text" to="/">
                        Beta01
                    </Link>
                </div>
                <div className="navbar-user">
                    {user ? profileImage : null}
                    {user ? profileLink : loginLink}
                </div>
            </div>
        );
    }
}

export default Navbar;
