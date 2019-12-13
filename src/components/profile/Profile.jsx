import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { getUserData } from "../../api/UsersApi";
import { getCurrentUser } from "../../api/AuthApi";
import "./Profile.css";
import Courses from "../courses/Courses";

class Profile extends Component {
    state = {
        user: "pending",
        defaultProfilePic: "/assets/images/profile_pic.png"
    };

    async componentDidMount() {
        const { loadbar, popup } = this.props;
        loadbar.start();
        const username = this.props.match.params.username;
        const user = await getUserData(username);
        if (user !== "pending") {
            loadbar.stop();
            if (user === null) popup.show("error", "404", "Not found");
        }
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
        const { loadbar, popup } = this.props;
        const currentUserData = getCurrentUser();
        const currentUser = currentUserData ? currentUserData.username : null;

        const editprofile_link =
            this.props.match.params.username === currentUser ? (
                <Link className="edit-profile-link" to="/user/edit">
                    <i className="material-icons edit-profile-icon">edit</i>
                    <span className="edit-profile-text">Edit profile</span>
                </Link>
            ) : null;

        const createcourse_link =
            this.props.match.params.username === currentUser ? (
                <Link className="create-course-link" to="/course/create">
                    <i className="material-icons create-course-icon">
                        create_new_folder
                    </i>
                    <span className="create-course-text">
                        Create a new course
                    </span>
                </Link>
            ) : null;

        const updatecourse_link =
            this.props.match.params.username === currentUser ? (
                <Link className="update-course-link" to="/course/update">
                    <i className="material-icons update-course-icon">
                        playlist_add
                    </i>
                    <span className="update-course-text">Update a course</span>
                </Link>
            ) : null;

        return user === "pending" ? null : user ? (
            <React.Fragment>
                <div className="profile-info">
                    <div className="profile-img-div">
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
                    <div className="profile-bio-container">
                        <p className="profile-bio">{user ? user.bio : ""}</p>
                    </div>
                    <br></br>
                    {editprofile_link}
                    <br></br>
                    {createcourse_link}
                    <br></br>
                    {updatecourse_link}
                </div>
                <Courses
                    {...this.props}
                    loadbar={loadbar}
                    popup={popup}
                    queryType="created"
                    user={user.id}
                />
            </React.Fragment>
        ) : (
            <Redirect to="/" />
        );
    }
}

export default Profile;
