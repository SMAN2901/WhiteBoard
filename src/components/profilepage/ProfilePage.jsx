import React, { Component } from "react";
import Profile from "../profile/Profile";
import Courses from "../courses/Courses";

class ProfilePage extends Component {
    state = {
        username: ""
    };

    componentDidMount() {
        window.scroll(0, 0);
    }

    componentDidUpdate(props) {
        const { username } = props.match.params;
        if (username !== this.state.username) this.setState({ username });
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
                <Profile
                    match={match}
                    history={history}
                    popup={popup}
                    user={user}
                />
                {user === "pending" ? null : (
                    <React.Fragment key={id}>
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
