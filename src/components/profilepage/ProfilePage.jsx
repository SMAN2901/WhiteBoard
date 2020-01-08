import React, { Component } from "react";
import Profile from "../profile/Profile";
import Courses from "../courses/Courses";

class ProfilePage extends Component {
    componentDidMount() {
        window.scroll(0, 0);
    }

    render() {
        const {
            loadbar,
            popup,
            user,
            match,
            history,
            courses,
            storeCourses
        } = this.props;
        const id = match.params.username;

        return (
            <React.Fragment>
                <Profile match={match} popup={popup} user={user} />
                {user === "pending" ? null : (
                    <React.Fragment>
                        <Courses
                            match={match}
                            history={history}
                            loadbar={loadbar}
                            popup={popup}
                            queryType="created"
                            label="Authored Courses"
                            user={user}
                            id={id}
                            courses={courses}
                            storeCourses={storeCourses}
                        />
                        <Courses
                            match={match}
                            history={history}
                            loadbar={loadbar}
                            popup={popup}
                            queryType="enrolled"
                            label="Enrolled Courses"
                            user={user}
                            id={id}
                            courses={courses}
                            storeCourses={storeCourses}
                        />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

export default ProfilePage;
