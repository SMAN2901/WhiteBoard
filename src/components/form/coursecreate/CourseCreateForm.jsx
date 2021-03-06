import React from "react";
import { Redirect } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import { isAuthenticated } from "../../../api/AuthApi";
import { createCourse } from "../../../api/CoursesApi";
import staticValues from "../../../staticValues.json";
import config from "../../../config.json";
import "./CourseCreateForm.css";

class CourseCreateForm extends Form {
    state = {
        data: {
            title: "",
            outline: "",
            prerequisites: "",
            tags: "",
            fee: "",
            language: staticValues.languages[0],
            length: "",
            difficulty: staticValues.courseDifficulties[0],
            banner: ""
        },
        errors: {},
        loading: false
    };

    schema = {
        title: Joi.string()
            .trim()
            .min(5)
            .max(100)
            .required()
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
        language: Joi.string().required(),
        length: Joi.number()
            .integer()
            .required(),
        difficulty: Joi.string().required(),
        banner: Joi.any().label("Banner")
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        const { loadbar } = this.props;
        loadbar.stop();
    }

    submitForm = async () => {
        const { loadbar, popup, setUpdateTrigger } = this.props;
        loadbar.start("Creating course");
        try {
            this.setState({ loading: true });
            const course = this.state.data;
            const banner = this.filefield.current.files[0];
            await createCourse(course, banner);
            setUpdateTrigger();
            loadbar.stop();
            popup.show("success", "Course created", "successfully");
            this.props.history.push("/course/latest");
        } catch (ex) {
            loadbar.stop();
            popup.show("error", "Error", "Couldn't create");
            this.setState({ loading: false });
        }
    };

    validateField = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        if (name === "banner") {
            const { files } = this.filefield.current;
            if (files.length > 0) {
                const file = this.filefield.current.files[0];
                return this.validateImage(file);
            }
        }

        return error ? error.details[0].message : null;
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
                        "Select banner",
                        "course-banner-filefield",
                        "course-banner-filefield-label",
                        this.filefield,
                        this.filefield_label
                    )}
                    {this.renderInput("tags", "Tags", "course-tags-inp")}
                    {this.renderSelectBox(
                        "language",
                        "Language",
                        "course-language-select",
                        staticValues.languages.map(item => ({
                            value: item,
                            text: item
                        }))
                    )}
                    {this.renderInput(
                        "length",
                        "Length (Hours)",
                        "course-length-inp"
                    )}
                    {this.renderSelectBox(
                        "difficulty",
                        "Difficulty",
                        "course-difficulty-select",
                        staticValues.courseDifficulties.map(item => ({
                            value: item,
                            text: item
                        }))
                    )}
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
