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
                or
                <Link className="navbar-signup" to="/signup">
                    Sign up
                </Link>
            </React.Fragment>
        );

        const profileLink = (
            <Link className="navbar-profile" to="#">
                {user ? `${user.first_name} ${user.last_name}` : ""}
            </Link>
        );

        return (
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link className="navbar-logo-text" to="/">
                        Beta01
                    </Link>
                </div>
                <div className="navbar-user">
                    {user ? profileLink : loginLink}
                </div>
            </div>
        );
    }
}

export default Navbar;
