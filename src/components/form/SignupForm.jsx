import React from "react";
import { Link } from "react-router-dom";
import Form from "./Form";
import Joi from "joi-browser";
import { signup } from "../../api/UsersApi";
import "./SignupForm.css";

class SignupForm extends Form {
    state = {
        data: {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        errors: {}
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
        username: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required()
            .label("Username"),
        email: Joi.string()
            .trim()
            .email({ minDomainAtoms: 2 })
            .label("Email"),
        password: Joi.string()
            .min(6)
            .max(100)
            .required()
            .label("Password"),
        confirmPassword: Joi.any()
            .valid(Joi.ref("password"))
            .required()
            .options({
                language: { any: { allowOnly: "must match password" } }
            })
    };

    signupButton = React.createRef();

    submitForm = async () => {
        try {
            const response = await signup(this.state.data);
            //localStorage.setItem("token", response.headers["auth-token"]);
            localStorage.setItem("token", response.data.token);
            this.props.history.push("/");
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                var errors = { ...this.state.errors };
                errors = ex.response.data.errors;
                this.setState({ errors });
            }
        }
    };

    render() {
        return (
            <div className="form-container">
                <form className="signup-form">
                    <div className="form-header">
                        <span className="form-title">Sign up here</span>
                    </div>
                    {this.renderInput(
                        "first_name",
                        "First Name",
                        "signup-firstname"
                    )}
                    {this.renderInput(
                        "last_name",
                        "Last Name",
                        "signup-lastname"
                    )}
                    {this.renderInput(
                        "username",
                        "Username",
                        "signup-username"
                    )}
                    {this.renderInput("email", "Email", "signup-email")}
                    {this.renderInput(
                        "password",
                        "Password",
                        "signup-password",
                        "password"
                    )}
                    {this.renderInput(
                        "confirmPassword",
                        "Confirm password",
                        "signup-confirmpassword",
                        "password"
                    )}
                    {this.renderButton(
                        "Sign up",
                        "signup-button",
                        this.signupButton
                    )}
                    <p className="signupform-footer">
                        Already have an account?
                    </p>
                    <Link className="signupform-login-link" to="/login">
                        Log in here
                    </Link>
                </form>
            </div>
        );
    }
}

export default SignupForm;
