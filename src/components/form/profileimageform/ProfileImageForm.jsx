import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../Form";
import config from "../../../config.json";
import { isAuthenticated } from "../../../api/AuthApi";
import { updateProfileImage } from "../../../api/UsersApi";
import "./ProfileImageForm.css";

class ProfileImageForm extends Form {
    state = {
        data: {
            profile_pic: ""
        },
        errors: {},
        loading: false
    };

    schema = {
        profile_pic: Joi.any().label("Profile image")
    };

    componentDidMount() {
        const { loadbar } = this.props;
        loadbar.stop();
    }

    submitForm = async () => {
        const { loadbar, popup } = this.props;

        try {
            if (this.filefield.current.files.length < 1) {
                popup.show("info", "Select an image", "to upload");
                return;
            }
            this.setState({ loading: true });
            loadbar.start("Uploading");
            const image = this.filefield.current.files[0];
            await updateProfileImage(image);
            loadbar.stop();
            popup.show("success", "Profile", "Updated");
            this.setState({ loading: false });
        } catch (ex) {
            loadbar.stop();
            popup.show("error", "Error", "Update failed");
            this.setState({ loading: true });
        }
    };

    validateField = () => {
        const file = this.filefield.current.files[0];
        return this.validateImage(file);
    };

    validateImage = file => {
        const { maxImageSize, imageTypes } = config.validation;

        if (!imageTypes.includes(file.type)) {
            return "Selected file is not an image";
        }

        if (file.size > maxImageSize) {
            return "File is too large.";
        }

        return null;
    };

    filefield = React.createRef();
    filefield_label = React.createRef();

    render() {
        return !isAuthenticated() ? (
            <Redirect to="/" />
        ) : (
            <div className="profile-image-form">
                {this.renderFileField(
                    "profile_pic",
                    "Select image",
                    "profile-image-field",
                    "profile-image-field-label",
                    this.filefield,
                    this.filefield_label
                )}
                {this.renderButton("Upload", "profile-image-upload-btn")}
            </div>
        );
    }
}

export default ProfileImageForm;
