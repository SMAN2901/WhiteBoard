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
import EditCourse from "./components/editcourse/EditCourse";
import EditCourseContent from "./components/editcoursecontent/EditCourseContent";
import CourseSearchPage from "./components/coursesearchpage/CourseSearchPage";
import ContentPage from "./components/contentpage/ContentPage";
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
        user: "pending",
        courses: {
            created: "pending",
            toprated: "pending",
            new: "pending",
            free: "pending",
            all: "pending",
            lastUpdated: {
                created: -1,
                toprated: -1,
                new: -1,
                free: -1,
                all: -1
            },
            expirationDelta: 600000
        }
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

        this.checkCoursesExpiration();
    }

    storeCourses = (type, fetchedCourses) => {
        var { courses } = this.state;
        courses[type] = fetchedCourses;
        courses.lastUpdated[type] = Date.now();
        this.setState({ courses });
    };

    checkCoursesExpiration = () => {
        var shouldUpdate = false;
        var { courses } = this.state;
        const currentTime = Date.now();

        for (var type in Object.keys(courses.lastUpdated)) {
            const lastUpdated = courses.lastUpdated[type];
            if (
                lastUpdated === -1 ||
                currentTime - lastUpdated > courses.expirationDelta
            ) {
                courses[type] = "pending";
                shouldUpdate = true;
            }
        }

        if (shouldUpdate) this.setState({ courses });
    };

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
        const { user, courses, loadbar, popup } = this.state;

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
                                    path="/update/course/:id"
                                    render={props => (
                                        <EditCourseContent
                                            {...props}
                                            key={user}
                                            user={user}
                                            loadbar={loadbar}
                                            popup={popup}
                                        />
                                    )}
                                />
                                <Route
                                    path="/edit/course/:id?"
                                    render={props => (
                                        <EditCourse
                                            {...props}
                                            key={user}
                                            user={user}
                                            loadbar={loadbar}
                                            popup={popup}
                                            courses={courses}
                                            storeCourses={this.storeCourses}
                                        />
                                    )}
                                />
                                <Route
                                    path="/user/:username"
                                    render={props => (
                                        <ProfilePage
                                            {...props}
                                            user={user}
                                            courses={courses}
                                            storeCourses={this.storeCourses}
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
                                    path="/course/category/:searchString"
                                    render={props => (
                                        <CourseSearchPage
                                            {...props}
                                            loadbar={loadbar}
                                            popup={popup}
                                            queryType="category"
                                        />
                                    )}
                                />
                                <Route
                                    path="/course/:id"
                                    render={props => (
                                        <CoursePage
                                            {...props}
                                            loadbar={loadbar}
                                            popup={popup}
                                            user={user}
                                            key={window.location.href}
                                        />
                                    )}
                                />
                                <Route
                                    path="/search/course/:searchString"
                                    render={props => (
                                        <CourseSearchPage
                                            {...props}
                                            loadbar={loadbar}
                                            popup={popup}
                                            queryType="search"
                                        />
                                    )}
                                />
                                <Route
                                    path="/content/:course_id/:content_id"
                                    render={props => (
                                        <ContentPage
                                            {...props}
                                            key={user}
                                            user={user}
                                            loadbar={loadbar}
                                            popup={popup}
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
                                            courses={courses}
                                            user={user}
                                            storeCourses={this.storeCourses}
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
