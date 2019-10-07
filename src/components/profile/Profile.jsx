import React, { Component } from "react";

class Profile extends Component {
    render() {
        const { user } = this.props;
        return <h1>{`Hello ${user.first_name} ${user.last_name}`}</h1>;
    }
}

export default Profile;
