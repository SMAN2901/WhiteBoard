import React from "react";
import { Redirect } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import { isAuthenticated, changePassword } from "../../../api/AuthApi";
import $ from "jquery";
import "./PasswordChangeForm.css";

class PasswordChangeForm extends Form {
    state = {
        data: {
            old_password: "",
            new_password: "",
            confirm_password: ""
        },
        errors: {},
        message:
            "You will be autometically logged out after changing your password.",
        errorMessage: "",
        loading: false
    };

    _isMounted = false;

    schema = {
        old_password: Joi.string()
            .min(6)
            .max(100)
            .required()
            .label("Old Password"),
        new_password: Joi.string()
            .min(6)
            .max(100)
            .required()
            .label("New Password"),
        confirm_password: Joi.string()
            .required()
            .label("Password")
    };

    componentDidMount() {
        this._isMounted = true;
        const { loadbar } = this.props;
        loadbar.stop();
        this.toggleForm();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    submitForm = async () => {
        const { loadbar, popup } = this.props;
        const { old_password, new_password } = this.state.data;
        const data = { old_password, new_password };

        loadbar.start();
        this.setState({ loading: true });
        const response = await changePassword(data);
        loadbar.stop();

        if (this._isMounted) {
            this.setState({ loading: false });

            if (response.success) {
                popup.show("success", "Password", "Changed");
            } else {
                var errorMessage = response.errors;
                this.setState({ errorMessage });
            }
        }
    };

    validateField = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        if (name === "confirm_password") {
            return value !== this.state.data["new_password"]
                ? "Password doesn't match"
                : null;
        }

        return error ? error.details[0].message : null;
    };

    toggleForm = () => {
        const className = ".pchange-form";
        const headerClass = "pchange-form-header";

        $(className)
            .children()
            .each(function() {
                const thisClass = $(this).attr("class");

                if (thisClass !== headerClass) {
                    $(this).slideToggle();
                }
            });
    };

    scrollToForm = () => {
        const className = ".pchange-form";
        const move = $(className).offset().top - 100;

        $("html,body").animate({ scrollTop: move }, 500);
    };

    render() {
        const { message, errorMessage } = this.state;

        return !isAuthenticated() ? (
            <Redirect to="/" />
        ) : (
            <div className="pchange-form-container">
                <form className="pchange-form" onClick={this.scrollToForm}>
                    <div
                        className="pchange-form-header"
                        onClick={this.toggleForm}
                    >
                        <span className="pchange-form-title">
                            Change Password
                        </span>
                    </div>
                    <p className="pchange-msg">{message}</p>
                    {this.renderInput(
                        "old_password",
                        "Old Password",
                        "pchange-password",
                        "password"
                    )}
                    {this.renderInput(
                        "new_password",
                        "New Password",
                        "pchange-password",
                        "password"
                    )}
                    {this.renderInput(
                        "confirm_password",
                        "Confirm Password",
                        "pchange-password",
                        "password"
                    )}
                    <div className="pchange-error">
                        <p className="pchange-error-text">{errorMessage}</p>
                    </div>
                    {this.renderButton("Save", "pchange-save-btn")}
                </form>
            </div>
        );
    }
}

export default PasswordChangeForm;
