import React from "react";
import { Redirect } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import { isAuthenticated } from "../../../api/AuthApi";
import { updateProfile } from "../../../api/UsersApi";
import staticValues from "../../../staticValues.json";
import "./ProfileEditForm.css";

class ProfileEditForm extends Form {
    state = {
        data: {
            first_name: this.props.user.first_name,
            last_name: this.props.user.last_name,
            gender: this.props.user.gender ? this.props.user.gender : "Male",
            bio: this.props.user.bio
        },
        errors: {},
        loading: false
    };

    schema = {
        first_name: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required()
            .label("First Name"),
        last_name: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required()
            .label("First Name"),
        gender: Joi.string().label("Gender"),
        bio: Joi.string()
            .max(500)
            .label("Bio")
    };

    componentDidMount() {
        const { loadbar } = this.props;
        loadbar.stop();
    }

    submitForm = async () => {
        const { loadbar, popup, user } = this.props;
        loadbar.start("Updating profile", "Please wait");
        try {
            this.setState({ loading: true });
            await updateProfile(this.state.data);
            loadbar.stop();
            popup.show("success", "Profile updated", "successfully");
            this.setState({ loading: false });
            window.location = "/user/" + user.username;
        } catch (ex) {
            loadbar.stop();
            popup.show("error", "Update", "failed");
            this.setState({ loading: false });
        }
    };

    validateField = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        return error ? error.details[0].message : null;
    };

    render() {
        return !isAuthenticated() ? (
            <Redirect to="/" />
        ) : (
            <div className="editprofile-form-container">
                <form className="editprofile-form">
                    <div className="editprofile-form-header">
                        <span className="editprofile-form-title">
                            Edit your profile
                        </span>
                    </div>
                    {this.renderInput(
                        "first_name",
                        "First Name",
                        "editprofile-firstname"
                    )}
                    {this.renderInput(
                        "last_name",
                        "Last Name",
                        "editprofile-lastname"
                    )}
                    {this.renderSelectBox(
                        "gender",
                        "Gender",
                        "editprofile-gender",
                        staticValues.genders.map(item => ({
                            value: item,
                            text: item
                        }))
                    )}
                    {this.renderTextArea("bio", "Bio", "editprofile-bio")}
                    {this.renderButton("Save", "editprofile-button")}
                </form>
            </div>
        );
    }
}

export default ProfileEditForm;
