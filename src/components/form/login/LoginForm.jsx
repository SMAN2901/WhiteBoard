import React from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import { login, isAuthenticated } from "../../../api/AuthApi";
import "./LoginForm.css";

class LoginForm extends Form {
    state = {
        data: {
            email: "",
            password: ""
        },
        errors: {}
    };

    schema = {
        email: Joi.string(),
        password: Joi.string()
    };

    componentDidMount() {
        const { loadbar } = this.props;
        loadbar.stop();
    }

    submitForm = async () => {
        const { loadbar, popup } = this.props;
        loadbar.start("Logging in");
        try {
            const { data } = await login(this.state.data);
            //localStorage.setItem("token", response.headers["auth-token"]);
            localStorage.setItem("token", data.token);
            loadbar.stop();
            popup.show("success", "Logged in", "successfully");
        } catch (ex) {
            if (ex.response && ex.response.status === 401) {
                //var errors = { ...this.state.errors };
                //errors = ex.response.data.errors;
                //this.setState({ errors });
                popup.show("error", "Invalid credentials", "Please try again");
            } else popup.show("error", "Error", "Something went wrong");
            loadbar.stop();
        }
    };

    render() {
        return isAuthenticated() ? (
            <Redirect to="/" />
        ) : (
            <div className="form-container">
                <img
                    className="login-img"
                    src="/assets/images/login.png"
                    alt=""
                ></img>
                <form className="login-form">
                    <div className="form-header">
                        <span className="form-title">Log in here</span>
                    </div>
                    {this.renderInput(
                        "email",
                        "Email or Username",
                        "login-email"
                    )}
                    {this.renderInput(
                        "password",
                        "Password",
                        "login-password",
                        "password"
                    )}
                    {this.renderButton("Log in", "login-button")}
                    <p className="loginform-footer">Don't have an account?</p>
                    <Link className="loginform-signup-link" to="/signup">
                        <span>Sign up here</span>
                    </Link>
                </form>
            </div>
        );
    }
}

export default LoginForm;
