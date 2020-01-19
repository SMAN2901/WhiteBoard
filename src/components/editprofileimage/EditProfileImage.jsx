import React, { Component } from "react";
import staticValues from "../../staticValues.json";
import "./EditProfileImage.css";
import ProfileImageForm from "../form/profileimageform/ProfileImageForm.jsx";

class EditProfileImage extends Component {
    render() {
        const { loadbar, popup, image } = this.props;
        const { defaultProfileImage } = staticValues.images;

        return (
            <div className="profile-img-div">
                <div className="profile-img-container">
                    <div className="profile-img-back-container">
                        <div
                            className="profile-img-back"
                            style={{
                                backgroundImage: `url(${
                                    image ? image : defaultProfileImage
                                })`
                            }}
                        ></div>
                    </div>
                    <div className="profile-img-holder">
                        <img
                            className="profile-img"
                            src={image ? image : defaultProfileImage}
                            alt=""
                        ></img>
                    </div>
                </div>
                <ProfileImageForm
                    {...this.props}
                    loadbar={loadbar}
                    popup={popup}
                />
            </div>
        );
    }
}

export default EditProfileImage;
