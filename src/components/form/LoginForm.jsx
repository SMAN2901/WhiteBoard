import React from "react";
import { Link } from "react-router-dom";
import Form from "./Form";
import Joi from "joi-browser";
import { login } from "../../api/UsersApi";
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
        email: Joi.string()
            .trim()
            .email({ minDomainAtoms: 2 })
            .label("Email"),
        password: Joi.string()
    };

    submitForm = async () => {
        try {
            const { data: token } = await login(this.state.data);
            //localStorage.setItem("token", response.headers["auth-token"]);
            localStorage.setItem("token", token);
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
                <form className="login-form">
                    <div className="form-header">
                        <span className="form-title">Log in here</span>
                    </div>
                    {this.renderInput("email", "Email", "login-email")}
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
