import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import EditProfileImage from "../editprofileimage/EditProfileImage";
import ProfileEditForm from "../form/profileeditform/ProfileEditForm";
import "./EditProfile.css";
import PasswordChangeForm from "../form/passwordchangeform/PasswordChangeForm";

class EditProfile extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.loadbar.stop();
    }

    render() {
        const { loadbar, popup, user } = this.props;

        return user !== "pending" ? (
            user ? (
                <div className="edit-profile-container">
                    <EditProfileImage
                        {...this.props}
                        loadbar={loadbar}
                        popup={popup}
                        image={user.profile_pic}
                    />
                    <div className="edit-profile-right">
                        <ProfileEditForm
                            {...this.props}
                            loadbar={loadbar}
                            popup={popup}
                            user={user}
                        />
                        <PasswordChangeForm
                            {...this.props}
                            loadbar={loadbar}
                            popup={popup}
                        />
                    </div>
                </div>
            ) : (
                <Redirect to="/" />
            )
        ) : null;
    }
}

export default EditProfile;
