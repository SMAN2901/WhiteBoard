import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
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
        const currentUser = this.props.user;
        if (currentUser === "pending") return;

        const currentUsername = currentUser ? currentUser.username : null;
        const username = this.props.match.params.username;

        if (username !== currentUsername) {
            const user = await getUserData(username);
            if (user === null) {
                const { popup } = this.props;
                popup.show("error", "404", "Not found");
                this.props.history.push("/");
            } else if (this._isMounted) {
                this.setState({ user });
                this.loadImage(user.profile_pic);
            }
        } else {
            if (this._isMounted) {
                this.setState({ user: currentUser });
                if (currentUser !== "pending") {
                    this.loadImage(currentUser.profile_pic);
                }
            }
        }
    }

    async componentDidUpdate() {
        const currentUser = this.props.user;
        if (currentUser === "pending") return;

        const currentUsername = currentUser ? currentUser.username : null;
        const username = this.props.match.params.username;

        if (username !== currentUsername) {
            if (username !== this.state.user.username) {
                if (this.state.user !== "pending") {
                    this.setState({ user: "pending" });
                }

                const user = await getUserData(username);

                if (user === null) {
                    const { popup } = this.props;
                    popup.show("error", "404", "Not found");
                    this.props.history.push("/");
                } else if (this._isMounted) {
                    this.setState({ user });
                    this.loadImage(user.profile_pic);
                }
            }
            return;
        }

        if (currentUsername !== this.state.user.username && this._isMounted) {
            await this.setState({ user: currentUser });
            this.loadImage(currentUser.profile_pic);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadImage = src => {
        if (src && this._isMounted) {
            this.setDefaultImage();

            var img = new Image();
            img.src = src;
            img.onload = () => {
                var { user } = this.state;
                user.profile_pic = src;
                this.setState({ user });
            };
        }
    };

    setDefaultImage = () => {
        var { user } = this.state;

        if (user !== "pending" && this._isMounted) {
            user.profile_pic = staticValues.images.defaultProfileImage;
            this.setState({ user });
        }
    };

    render() {
        const { user } = this.state;
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
                <Link className="update-course-link" to="/edit/course">
                    <i className="material-icons update-course-icon">
                        playlist_add
                    </i>
                    <span className="update-course-text">Update a course</span>
                </Link>
            ) : null;

        return user === "pending" ? null : user ? (
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
        ) : (
            <Redirect to="/" />
        );
    }
}

export default Profile;
