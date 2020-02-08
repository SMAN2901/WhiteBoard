import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { getUserData } from "../../api/UsersApi";
import { getCurrentUser } from "../../api/AuthApi";
import { getTimeDifference } from "../../services/util";
import staticValues from "../../staticValues.json";
import $ from "jquery";
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
                if (this.state.user !== "pending" && this._isMounted) {
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

        const stateUser =
            this.state.user === "pending" || this.state.user === null
                ? null
                : this.state.user;
        const currentPic =
            currentUser !== "pending" && currentUser !== null
                ? currentUser.profile_pic
                : null;
        const statePic =
            this.state.user !== "pending" && this.state.use !== null
                ? this.state.user.profile_pic
                : null;

        if (currentUser !== stateUser && this._isMounted) {
            await this.setState({ user: currentUser });
        }
        if (currentPic !== statePic && this._isMounted) {
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
                if (this._isMounted) this.setState({ user });
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

    toggleOptions = () => {
        const className = ".profile-option-text-container";
        const iconClass = ".profile-option-expand-icon";
        const icon = $(iconClass).text();
        const newIcon =
            "keyboard_arrow_" +
            (icon === "keyboard_arrow_left" ? "right" : "left");

        $(className).animate({ width: "toggle" });
        $(iconClass).text(newIcon);
    };

    enlistOptions = () => {
        const className = ".profile-op";
        const txtClass = ".profile-op-text-container";
        const iconClass = ".profile-op-expand-icon";
        const expClass = ".profile-op-expand";
        const icon = $(iconClass).text();
        const display = $(className).css("display");
        const newIcon =
            "keyboard_arrow_" + (icon === "keyboard_arrow_up" ? "down" : "up");
        const newDisplay = display === "block" ? "inline-block" : "block";

        if (display === "block") {
            $(expClass).css(
                "border-right",
                "2px solid rgba(255, 255, 255, 0.1)"
            );
            $(txtClass).animate({ width: "toggle" }, 0, () => {
                $(className).css({
                    border: "none",
                    "border-right": "2px solid rgba(255, 255, 255, 0.1)"
                });
                $(className).css("display", newDisplay);
            });
        } else {
            $(expClass).css("border", "none");
            $(className).css({
                border: "none",
                "border-top": "2px solid rgba(255, 255, 255, 0.1)"
            });
            $(className).css("display", newDisplay);
            $(txtClass).animate({ width: "toggle" });
        }

        $(iconClass).text(newIcon);
    };

    renderOption = (link, icon, text, classes) => {
        return (
            <Link className={classes} to={link}>
                <i className={classes + "-icon material-icons"}>{icon}</i>
                <div className={classes + "-text-container"}>
                    <label className={classes + "-text"}>{text}</label>
                </div>
            </Link>
        );
    };

    renderOptions = classes => {
        return (
            <div className={classes + "-container"}>
                {classes === "profile-op" ? (
                    <div
                        className={classes + "-expand"}
                        onClick={this.enlistOptions}
                    >
                        <i className={classes + "-expand-icon material-icons"}>
                            keyboard_arrow_up
                        </i>
                    </div>
                ) : null}
                {this.renderOption("/inbox", "mail", "Messages", classes)}
                {this.renderOption(
                    "/edit/profile",
                    "edit",
                    "Edit profile",
                    classes
                )}
                {this.renderOption(
                    "/course/create",
                    "create_new_folder",
                    "Create course",
                    classes
                )}
                {this.renderOption(
                    "/edit/course",
                    "amp_stories",
                    "Edit course",
                    classes
                )}
                {this.renderOption(
                    "/blog/entry",
                    "subject",
                    "Write blog",
                    classes
                )}
                {classes !== "profile-op" ? (
                    <div
                        className={classes + "-expand"}
                        onClick={this.toggleOptions}
                    >
                        <i className="material-icons profile-option-expand-icon">
                            keyboard_arrow_left
                        </i>
                    </div>
                ) : null}
                <img
                    src=""
                    alt=""
                    onError={
                        classes === "profile-op"
                            ? this.enlistOptions
                            : this.toggleOptions
                    }
                ></img>
            </div>
        );
    };

    renderStars = rating => {
        var a = [];
        var b = [];
        var n = Math.floor(rating);

        for (var i = 0; i < n; i++) a.push(i);
        for (var j = 0; j < 5 - n; j++) b.push(j);

        if (rating - n >= 0.5) b.pop();

        return (
            <div className="profile-rating-container">
                {a.map(i => (
                    <i className="material-icons profile-rating-icon" key={i}>
                        star
                    </i>
                ))}
                {rating - n >= 0.5 ? (
                    <i className="material-icons profile-rating-icon">
                        star_half
                    </i>
                ) : null}
                {b.map(i => (
                    <i
                        className="material-icons profile-rating-icon"
                        key={i + 10}
                    >
                        star_border
                    </i>
                ))}
            </div>
        );
    };

    renderProfileImage = img => {
        return (
            <div className="profile-img-container">
                <div className="profile-img-back-container">
                    <div
                        className="profile-img-back"
                        style={{ backgroundImage: `url(${img})` }}
                    ></div>
                </div>
                <div className="profile-img-holder">
                    <img className="profile-img" src={img} alt=""></img>
                </div>
            </div>
        );
    };

    render() {
        const { user } = this.state;
        const currentUserData = getCurrentUser();
        const currentUser = currentUserData ? currentUserData.username : null;
        const { username } = this.props.match.params;

        return user === "pending" ? null : user ? (
            <div className="profile-container">
                <div className="profile-info">
                    <div className="profile-info-basic">
                        {this.renderProfileImage(
                            user.profile_pic
                                ? user.profile_pic
                                : staticValues.images.defaultProfileImage
                        )}
                        <p className="profile-name">{`${user.first_name} ${user.last_name}`}</p>
                        <p className="profile-email">{user.email}</p>
                        {user.activity.rating > 0 ? (
                            <React.Fragment>
                                <p className="profile-rating-text">
                                    Author rating
                                </p>
                                {this.renderStars(user.activity.rating)}
                            </React.Fragment>
                        ) : null}
                        <div>
                            <div className="profile-ls-icon"></div>
                            <p className="profile-ls-text">
                                {"Last online: " +
                                    getTimeDifference(user.login_time) +
                                    " ago"}
                            </p>
                            {currentUser !== user.username ? (
                                <Link
                                    className="profile-message-link"
                                    to={"/inbox/" + user.username}
                                >
                                    <i className="profile-message-link-icon material-icons">
                                        mail
                                    </i>
                                    <p className="profile-message-link-text">
                                        Send message
                                    </p>
                                </Link>
                            ) : null}
                        </div>
                    </div>
                    <div className="profile-info-details">
                        <p className="profile-info-header">About</p>
                        <p className="profile-bio">{user.bio}</p>
                        <p className="profile-info-header">Acitivity</p>
                        <div className="profile-bcount-container">
                            <i className="material-icons profile-bcount-icon">
                                person_pin
                            </i>
                            <p className="profile-bcount-text">
                                {`Enrolled in ${user.activity.enrolled} courses`}
                            </p>
                        </div>
                        <div className="profile-bcount-container">
                            <i className="material-icons profile-bcount-icon">
                                how_to_reg
                            </i>
                            <p className="profile-bcount-text">
                                {`Authored ${user.activity.author} courses`}
                            </p>
                        </div>
                        <div className="profile-bcount-container">
                            <i className="material-icons profile-bcount-icon profile-bcount-icon-sp1">
                                loyalty
                            </i>
                            <p className="profile-bcount-text">{`Bestseller: ${user.activity.bestseller}`}</p>
                        </div>
                        <div className="profile-bcount-container">
                            <i className="material-icons profile-bcount-icon profile-bcount-icon-sp1">
                                loyalty
                            </i>
                            <p className="profile-bcount-text">{`Top rated: ${user.activity.top_rated}`}</p>
                        </div>
                        <div className="profile-bcount-container">
                            <i className="material-icons profile-bcount-icon profile-bcount-icon-sp2">
                                card_giftcard
                            </i>
                            <p className="profile-bcount-text">
                                {`Free courses: ${user.activity.free}`}
                            </p>
                        </div>
                        <div className="profile-bcount-container">
                            <i className="material-icons profile-bcount-icon">
                                bar_chart
                            </i>
                            <p className="profile-bcount-text">
                                {`Author rating: ${
                                    user.activity.rating > 0
                                        ? user.activity.rating.toFixed(1)
                                        : "N/A"
                                }`}
                            </p>
                        </div>
                        {user.activity.blogs > 0 ? (
                            <Link
                                to={`/blog/user/${user.username}`}
                                className="profile-blog-link"
                            >
                                <div className="profile-bcount-container">
                                    <i className="material-icons profile-bcount-icon profile-bcount-icon-sp3">
                                        subject
                                    </i>
                                    <p className="profile-bcount-text pb-link">
                                        {`Blogs written: ${user.activity.blogs}`}
                                    </p>
                                </div>
                            </Link>
                        ) : null}
                    </div>
                </div>
                {currentUser && currentUser === username
                    ? this.renderOptions("profile-option")
                    : null}
                {currentUser && currentUser === username
                    ? this.renderOptions("profile-op")
                    : null}
            </div>
        ) : (
            <Redirect to="/" />
        );
    }
}

export default Profile;
