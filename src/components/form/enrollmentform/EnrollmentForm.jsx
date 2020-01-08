import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../../../api/AuthApi";
import { getCourse, enroll } from "../../../api/CoursesApi";
import "./EnrollmentForm.css";

class EnrollmentForm extends Component {
    state = {
        course: "pending",
        errors: "",
        loading: false
    };

    async componentDidMount() {
        window.scrollTo(0, 0);
        this.props.loadbar.stop();

        var course = "pending";
        const { loadbar, popup, match } = this.props;
        const { id } = match.params;

        loadbar.start();
        try {
            course = await getCourse(id);
            if (course !== "pending") {
                loadbar.stop();
                this.setState({ course });
            }
        } catch (ex) {
            loadbar.stop();
            this.setState({ course: null });
            if (ex.response && ex.response.status === 404) {
                popup.show("error", "404", "Not found");
            } else popup.show("error", "Error", "Something went wrong");
        }
    }

    onSubmit = async () => {
        const { loadbar, popup, match, history } = this.props;
        const { id } = match.params;
        const fakeCard = {
            card_no: "1234123412341234"
        };

        loadbar.start();
        this.setState({ loading: true });
        const data = await enroll(id, fakeCard);
        loadbar.stop();
        this.setState({ loading: false });

        if (data.errors === "") {
            popup.show("success", "Sucessfully", "Enrolled");
            history.push("/course/" + id);
        } else {
            popup.show("error", "Enrollment", "Unsuccessful");
            this.setState({ errors: data.errors });
        }
    };

    render() {
        const { user } = this.props;
        const { course } = this.state;

        return !isAuthenticated() ? (
            <Redirect to="/" />
        ) : user !== "pending" &&
          user !== null &&
          course !== "pending" &&
          course !== null ? (
            <div className="enroll-form-container">
                <form className="enroll-form">
                    <div className="enroll-form-cinfo">
                        <p className="enroll-form-cinfo-header">
                            Order Summery
                        </p>
                        <p className="enroll-form-cinfo-title">
                            {course.title}
                        </p>
                        <div className="enroll-form-cinfo-fc">
                            <p className="enroll-form-cinfo-ft">Course fee</p>
                            <p className="enroll-form-cinfo-ff">
                                {course.fee.toFixed(2).toString() + "$"}
                            </p>
                        </div>
                        <div className="enroll-form-cinfo-fc">
                            <p className="enroll-form-cinfo-ft">Discount</p>
                            <p className="enroll-form-cinfo-ff">- 0.00$</p>
                        </div>
                        <div className="enroll-form-cinfo-fc">
                            <p className="enroll-form-cinfo-ft enroll-form-cinfo-big">
                                Total
                            </p>
                            <p className="enroll-form-cinfo-ff enroll-form-cinfo-big">
                                {course.fee.toFixed(2).toString() + "$"}
                            </p>
                        </div>
                    </div>
                    <div className="enroll-form-uinfo">
                        <p className="enroll-form-uinfo-header">
                            User Information
                        </p>
                        <p className="enroll-form-uinfo-name">
                            {`${user.first_name} ${user.last_name}`}
                        </p>
                        <p className="enroll-form-uinfo-email">{user.email}</p>
                    </div>
                    <div className="enroll-form-pinfo">
                        <p className="enroll-form-pinfo-header">
                            Payment Information
                        </p>
                        {course.fee > 0 ? (
                            <React.Fragment>
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="enroll-form-pinfo-cno"
                                ></input>
                                <input
                                    type="text"
                                    placeholder="Expiration Date"
                                    className="enroll-form-pinfo-inp"
                                ></input>
                                <input
                                    type="text"
                                    placeholder="CVC Code"
                                    className="enroll-form-pinfo-inp"
                                ></input>
                                <input
                                    type="text"
                                    placeholder="Country"
                                    className="enroll-form-pinfo-inp"
                                ></input>
                                <input
                                    type="text"
                                    placeholder="Postal Code"
                                    className="enroll-form-pinfo-inp"
                                ></input>
                            </React.Fragment>
                        ) : null}
                        <button
                            className="enroll-form-enroll-btn"
                            onClick={this.onSubmit}
                            disabled={this.state.loading}
                        >
                            {course.fee > 0 ? "Enroll" : "Enroll for free"}
                        </button>
                        <p className="enroll-form-error">{this.state.errors}</p>
                    </div>
                </form>
            </div>
        ) : null;
    }
}

export default EnrollmentForm;
