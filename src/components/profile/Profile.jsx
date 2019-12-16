import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Courses from "../courses/Courses";
import { getUserData } from "../../api/UsersApi";
import { getCurrentUser } from "../../api/AuthApi";
import staticValues from "../../staticValues.json";
import "./Profile.css";

class Profile extends Component {
    state = {
        user: "pending"
    };

    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        window.scrollTo(0, 0);
        const { loadbar, popup } = this.props;

        if (this._isMounted) {
            loadbar.start();
            const username = this.props.match.params.username;
            const user = await getUserData(username);
            if (user !== "pending") {
                loadbar.stop();
                if (user === null) popup.show("error", "404", "Not found");
            }
            this.setState({ user });
        }
    }

    async componentDidUpdate(props) {
        const username = this.props.match.params.username;
        const prev = props.match.params.username;

        if (username !== prev && this._isMounted) {
            this.setState({
                user: "pending",
                defaultProfilePic: staticValues.images.defaultProfileImage
            });
            const { loadbar } = this.props;
            loadbar.start();
            const user = await getUserData(username);
            if (user) loadbar.stop();
            this.setState({ user });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.loadbar.stop();
    }

    render() {
        const { user } = this.state;
        const { loadbar, popup } = this.props;
        const currentUserData = getCurrentUser();
        const currentUser = currentUserData ? currentUserData.username : null;

        const editprofile_link =
            this.props.match.params.username === currentUser ? (
                <Link className="edit-profile-link" to="/edit/profile">
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
                            <div className="profile-img-back-container">
                                <div
                                    className="profile-img-back"
                                    style={{
                                        backgroundImage: `url(${
                                            user.profile_pic
                                                ? user.profile_pic
                                                : staticValues.images
                                                      .defaultProfileImage
                                        })`
                                    }}
                                ></div>
                            </div>
                            <div className="profile-img-holder">
                                <img
                                    className="profile-img"
                                    src={
                                        user.profile_pic
                                            ? user.profile_pic
                                            : staticValues.images
                                                  .defaultProfileImage
                                    }
                                    alt=""
                                ></img>
                            </div>
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
