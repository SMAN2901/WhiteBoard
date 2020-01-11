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
import EnrollmentForm from "./components/form/enrollmentform/EnrollmentForm";
import { getCurrentUser, checkAuthToken } from "./api/AuthApi";
import { getUserData } from "./api/UsersApi";
import {
    getCreatedCourses,
    getEnrolledCourses,
    getFreeCourses,
    getNewCourses,
    getTopRatedCourses,
    getBestsellerCourses
} from "./api/CoursesApi";
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
            bestseller: "pending",
            toprated: "pending",
            new: "pending",
            free: "pending",
            enrolled: "pending",
            func: {
                created: getCreatedCourses,
                bestseller: getBestsellerCourses,
                toprated: getTopRatedCourses,
                new: getNewCourses,
                free: getFreeCourses,
                enrolled: getEnrolledCourses
            }
        },
        needUpdate: true
    };

    async componentDidMount() {
        window.scrollTo(0, 0);
        await checkAuthToken();
        var user = getCurrentUser();
        if (user) user = await getUserData(user.username);

        this.setState({ user });
    }

    setUpdateTrigger = () => {
        this.setState({ needUpdate: true });
    };

    async componentDidUpdate() {
        if (!this.state.needUpdate) return;

        var user = getCurrentUser();

        if (user) user = await getUserData(user.username);
        var needUpdate = false;
        this.setState({ user, needUpdate });

        this.updateCourses();
    }

    updateCourses = async () => {
        var { user } = this.state;
        var keys = Object.keys(this.state.courses.func);

        for (var type in keys) {
            var key = keys[type];

            try {
                var data = "pending";
                if (key === "created" || key === "enrolled") {
                    if (user !== "pending" && user !== null) {
                        data = await this.state.courses.func[key](
                            user.username
                        );
                    }
                } else data = await this.state.courses.func[key]();

                if (data !== "pending" && this.state.courses[key] !== data) {
                    var { courses } = this.state;
                    courses[key] = data;
                    this.setState({ courses });
                }
            } catch (ex) {}
        }
    };

    storeCourses = (type, fetchedCourses) => {
        var { courses } = this.state;
        courses[type] = fetchedCourses;
        this.setState({ courses });
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
                                            setUpdateTrigger={
                                                this.setUpdateTrigger
                                            }
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
                                            setUpdateTrigger={
                                                this.setUpdateTrigger
                                            }
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
                                            setUpdateTrigger={
                                                this.setUpdateTrigger
                                            }
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
                                            setUpdateTrigger={
                                                this.setUpdateTrigger
                                            }
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
                                            setUpdateTrigger={
                                                this.setUpdateTrigger
                                            }
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
                                            setUpdateTrigger={
                                                this.setUpdateTrigger
                                            }
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
                                            setUpdateTrigger={
                                                this.setUpdateTrigger
                                            }
                                        />
                                    )}
                                />
                                <Route
                                    path="/enroll/:id"
                                    render={props => (
                                        <EnrollmentForm
                                            {...props}
                                            key={window.location.href}
                                            user={user}
                                            loadbar={loadbar}
                                            popup={popup}
                                            setUpdateTrigger={
                                                this.setUpdateTrigger
                                            }
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
                                            key={courses}
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
