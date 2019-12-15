import React, { Component } from "react";
import EditProfileImage from "../editprofileimage/EditProfileImage";
import "./EditProfile.css";

class EditProfile extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { loadbar, popup, user } = this.props;

        return user ? (
            <div className="edit-profile-container">
                <EditProfileImage
                    {...this.props}
                    loadbar={loadbar}
                    popup={popup}
                    image={user.profile_pic}
                />
            </div>
        ) : null;
    }
}

export default EditProfile;
