import React from "react";
import { Redirect } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import { isAuthenticated } from "../../../api/AuthApi";
import { createCourse } from "../../../api/CoursesApi";
import "./CourseCreateForm.css";

class CourseCreateForm extends Form {
    state = {
        data: {
            title: "",
            outline: "",
            prerequisites: "",
            tags: "",
            fee: "",
            banner: ""
        },
        errors: {}
    };

    schema = {
        title: Joi.string()
            .trim()
            .min(5)
            .max(100)
            .label("Title"),
        outline: Joi.string()
            .trim()
            .min(30)
            .max(2000)
            .required()
            .label("Course Outline"),
        prerequisites: Joi.string()
            .trim()
            .min(30)
            .max(500)
            .required()
            .label("Prerequisites"),
        tags: Joi.string().label("Tags"),
        fee: Joi.number()
            .required()
            .label("Course Fee"),
        banner: Joi.any().label("Banner")
    };

    componentDidMount() {
        const { loadbar } = this.props;
        loadbar.stop();
    }

    submitForm = async () => {
        const { loadbar, popup } = this.props;
        loadbar.start("Creating course");
        try {
            const course = this.state.data;
            const banner = this.filefield.current.files[0];
            await createCourse(course, banner);
            loadbar.stop();
            popup.show("success", "Course created", "successfully");
            this.props.history.push("/course/latest");
        } catch (ex) {
            loadbar.stop();
            popup.show("error", "Error", "Couldn't create");
        }
    };

    validateField = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        if (name === "banner") {
            const file = this.filefield.current.files[0];
            return this.validateImage(file);
        }

        return error ? error.details[0].message : null;
    };

    validateImage = file => {
        const imageTypes = ["image/gif", "image/jpeg", "image/png"];
        const maxFilesize = 2 * 1024 * 1024;

        if (!imageTypes.includes(file.type)) {
            return "Selected file is not an image";
        }

        if (file.size > maxFilesize) {
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
            <div className="course-form-container">
                <form className="course-form">
                    <div className="course-form-header">
                        <span className="course-form-title">
                            Create a new course
                        </span>
                    </div>
                    {this.renderInput(
                        "title",
                        "Course Title",
                        "course-title-inp"
                    )}
                    {this.renderTextArea(
                        "outline",
                        "Course Outline",
                        "course-outline-inp"
                    )}
                    {this.renderTextArea(
                        "prerequisites",
                        "Prerequisites",
                        "prerequisites-inp"
                    )}
                    {this.renderFileField(
                        "banner",
                        "Select file",
                        "course-banner-filefield",
                        "course-banner-filefield-label",
                        this.filefield,
                        this.filefield_label
                    )}
                    {this.renderInput("tags", "Tags", "course-tags-inp")}
                    {this.renderInput(
                        "fee",
                        "Course Fee in USD",
                        "course-fee-inp"
                    )}
                    {this.renderButton("Submit", "course-create-button")}
                </form>
            </div>
        );
    }
}

export default CourseCreateForm;
