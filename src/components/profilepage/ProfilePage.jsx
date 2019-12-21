import React, { Component } from "react";
import Profile from "../profile/Profile";
import Courses from "../courses/Courses";

class ProfilePage extends Component {
    componentDidMount() {
        window.scroll(0, 0);
    }

    render() {
        const { loadbar, popup, user, match, history } = this.props;
        const id = match.params.username;

        return (
            <React.Fragment>
                <Profile match={match} popup={popup} user={user} />
                <Courses
                    match={match}
                    history={history}
                    loadbar={loadbar}
                    popup={popup}
                    queryType="created"
                    label={`Authored Courses`}
                    user={id}
                />
            </React.Fragment>
        );
    }
}

export default ProfilePage;
