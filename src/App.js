import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import CacheBuster from "./CacheBuster";
import Navbar from "./components/navbar/Navbar";
import Loadbar from "./components/loadbar/Loadbar";
import Home from "./components/home/Home";
import LoginForm from "./components/form/login/LoginForm";
import SignupForm from "./components/form/signup/SignupForm";
import CourseCreateForm from "./components/form/coursecreate/CourseCreateForm";
import ProfilePage from "./components/profilepage/ProfilePage";
import EditProfile from "./components/editprofile/EditProfile";
import CoursePage from "./components/coursepage/CoursePage";
import { getCurrentUser, checkAuthToken } from "./api/AuthApi";
import { getUserData } from "./api/UsersApi";
import "./App.css";

class App extends Component {
    state = {
        loadbar: {
            display: false,
            text: "Loading",
            subtext: "Please wait",
            defaultText: "Loading",
            defaultSubtext: "Please wait"
        },
        popup: {
            display: false,
            type: "success",
            text: null,
            subtext: null
        },
        user: "pending"
    };

    async componentDidMount() {
        window.scrollTo(0, 0);
        await checkAuthToken();
        var user = getCurrentUser();
        if (user) user = await getUserData(user.username);

        this.setState({ user });
    }

    async componentDidUpdate() {
        var user = getCurrentUser();
        var prevUser = this.state.user;
        if (prevUser && user) {
            if (prevUser !== "pending" && prevUser !== user) {
                user = await getUserData(user.username);
                this.setState({ user });
            }
        } else {
            if (user) {
                user = await getUserData(user.username);
                this.setState({ user });
            }
        }
    }

    startLoading = (text, subtext) => {
        const { loadbar } = this.state;
        if (text) loadbar.text = text;
        if (subtext) loadbar.subtext = subtext;
        loadbar.display = true;

        this.setState({ loadbar });
    };

    stopLoading = () => {
        const { loadbar } = this.state;
        loadbar.text = loadbar.defaultText;
        loadbar.subtext = loadbar.defaultSubtext;
        loadbar.display = false;

        this.setState({ loadbar });
    };

    showPopup = (type, text, subtext, delay = 3000) => {
        if (!text && !subtext) return;
        if (text.length < 1 && subtext.length < 1) return;
        const { popup } = this.state;
        popup.display = true;
        popup.type = type;
        popup.text = text;
        popup.subtext = subtext;

        this.setState({ popup });

        setTimeout(this.hidePopup, delay);
    };

    hidePopup = () => {
        const { popup } = this.state;
        popup.display = false;
        popup.type = "success";
        popup.text = null;
        popup.subtext = null;

        this.setState({ popup });
    };

    render() {
        const { user, loadbar, popup } = this.state;

        loadbar.start = this.startLoading;
        loadbar.stop = this.stopLoading;
        popup.show = this.showPopup;
        popup.hide = this.hidePopup;

        return (
            <CacheBuster>
                {({ loading, isLatestVersion, refreshCacheAndReload }) => {
                    if (loading) return null;
                    if (!loading && !isLatestVersion) {
                        refreshCacheAndReload();
                    }
                    return (
                        <React.Fragment>
                            <Navbar user={user} />
                            <Loadbar loadbar={loadbar} popup={popup} />
                            <Switch>
                                <Route
                                    path="/login"
                                    render={props => (
                                        <LoginForm
                                            {...props}
                                            loadbar={loadbar}
                                            popup={popup}
                                        />
                                    )}
                                />
                                <Route
                                    path="/signup"
                                    render={props => (
                                        <SignupForm
                                            {...props}
                                            loadbar={loadbar}
                                            popup={popup}
                                        />
                                    )}
                                />
                                <Route
                                    path="/edit/profile"
                                    render={props => (
                                        <EditProfile
                                            {...props}
                                            user={user}
                                            loadbar={loadbar}
                                            popup={popup}
                                        />
                                    )}
                                />
                                <Route
                                    path="/user/:username?"
                                    render={props => (
                                        <ProfilePage
                                            {...props}
                                            user={user}
                                            loadbar={loadbar}
                                            popup={popup}
                                            key={window.location.href}
                                        />
                                    )}
                                />
                                <Route
                                    path="/course/create"
                                    render={props => (
                                        <CourseCreateForm
                                            {...props}
                                            loadbar={loadbar}
                                            popup={popup}
                                        />
                                    )}
                                />
                                <Route
                                    path="/course/:id?"
                                    render={props => (
                                        <CoursePage
                                            {...props}
                                            loadbar={loadbar}
                                            popup={popup}
                                            key={window.location.href}
                                        />
                                    )}
                                />
                                <Route
                                    path="/"
                                    render={props => (
                                        <Home
                                            {...props}
                                            loadbar={loadbar}
                                            popup={popup}
                                        />
                                    )}
                                />
                            </Switch>
                        </React.Fragment>
                    );
                }}
            </CacheBuster>
        );
    }
}

export default App;
