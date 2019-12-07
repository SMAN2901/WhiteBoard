import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../../api/UsersApi";
import { getCurrentUser } from "../../api/AuthApi";
import "./Profile.css";

class Profile extends Component {
    state = {
        user: "pending",
        defaultProfilePic: "/assets/images/profile_pic.png"
    };

    async componentDidMount() {
        const { loadbar } = this.props;
        loadbar.start();
        const username = this.props.match.params.username;
        const user = await getUserData(username);
        if (user) loadbar.stop();
        this.setState({ user });
    }

    async componentDidUpdate(props) {
        const username = this.props.match.params.username;
        const prev = props.match.params.username;

        if (username !== prev) {
            this.setState({
                user: "pending",
                defaultProfilePic: "/assets/images/profile_pic.png"
            });
            const { loadbar } = this.props;
            loadbar.start();
            const user = await getUserData(username);
            if (user) loadbar.stop();
            this.setState({ user });
        }
    }

    /*static async getDerivedStateFromProps(nextProps, prevState) {
        const username = nextProps.match.params.username;
        const prevUser =
            typeof prevState.user === "undefined" ? null : prevState.user;

        if (!prevUser || prevUser === {} || prevUser === "pending") return null;
        if (username !== prevUser.username) {
            //console.log(username, prevUser);
            window.location = window.location.href;
        }
        return null;
    }*/

    render() {
        const { user } = this.state;
        const currentUserData = getCurrentUser();
        const currentUser = currentUserData ? currentUserData.username : null;

        const createcourse_link =
            this.props.match.params.username === currentUser ? (
                <Link className="create-course-btn" to="/createcourse">
                    Create a new course
                </Link>
            ) : null;

        return user === "pending" ? null : user ? (
            <React.Fragment>
                <div className="profile-info">
                    <div className="profile-info-left">
                        <div className="profile-img-container">
                            <div className="profile-img-outer"></div>
                            <div className="profile-img-inner"></div>
                            <img
                                className="profile-img"
                                src={
                                    user.profile_pic
                                        ? user.profile_pic
                                        : this.state.defaultProfilePic
                                }
                                alt=""
                            ></img>
                        </div>
                        <br></br>
                        <span className="profile-name">
                            {user ? `${user.first_name} ${user.last_name}` : ""}
                        </span>
                        <br></br>
                        <span className="profile-email">
                            {user ? user.email : ""}
                        </span>
                    </div>
                    <div className="profile-info-right">
                        <p className="profile-bio">{user ? user.bio : ""}</p>
                    </div>
                </div>
                {createcourse_link}
            </React.Fragment>
        ) : (
            <h2 style={{ color: "red" }}>Not Found</h2>
        );
    }
}

export default Profile;
