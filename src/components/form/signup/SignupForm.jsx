import React from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import { signup, isAuthenticated, storeAuthToken } from "../../../api/AuthApi";
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

    componentDidMount() {
        const { loadbar } = this.props;
        loadbar.stop();
    }

    signupButton = React.createRef();

    submitForm = async () => {
        const { loadbar, popup } = this.props;
        loadbar.start("Signing up");
        try {
            const { data } = await signup(this.state.data);
            //localStorage.setItem("token", response.headers["auth-token"]);
            //localStorage.setItem("token", response.data.token);
            storeAuthToken(data.token);
            loadbar.stop();
            popup.show("success", "Signed up", "successfully");
        } catch (ex) {
            loadbar.stop();
            if (ex.response && ex.response.status === 400) {
                var errors = { ...this.state.errors };
                errors = ex.response.data.errors;
                this.setState({ errors });
            }
            popup.show("error", "Sign up", "failed");
        }
    };

    validateField = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        if (name === "confirmPassword") {
            return value !== this.state.data.password
                ? "Password doesn't match"
                : null;
        }

        return error ? error.details[0].message : null;
    };

    render() {
        return isAuthenticated() ? (
            <Redirect to="/" />
        ) : (
            <div className="form-container">
                <img
                    className="signup-img"
                    src="/assets/images/signup.png"
                    alt=""
                ></img>
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
