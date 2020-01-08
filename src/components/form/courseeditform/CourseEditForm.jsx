import React from "react";
import { Redirect, Link } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import { isAuthenticated } from "../../../api/AuthApi";
import { updateCourse } from "../../../api/CoursesApi";
import { getTagString } from "../../../api/ApiUtility";
import staticValues from "../../../staticValues.json";
import "./CourseEditForm.css";

class CourseEditForm extends Form {
    state = {
        data: {
            title: this.props.course.title,
            outline: this.props.course.outline,
            prerequisites: this.props.course.prerequisites,
            tags: getTagString(this.props.course.tags),
            fee: this.props.course.fee,
            language: this.props.course.language,
            length: this.props.course.length,
            difficulty: this.props.course.difficulty,
            private: this.props.course.private
        },
        errors: {},
        loading: false
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
        language: Joi.string().required(),
        length: Joi.number()
            .integer()
            .required(),
        difficulty: Joi.string().required(),
        private: Joi.boolean().required()
    };

    componentDidMount() {
        const { loadbar } = this.props;
        loadbar.stop();
    }

    submitForm = async () => {
        const { loadbar, popup } = this.props;
        loadbar.start("Updating course");
        try {
            this.setState({ loading: true });
            const course = this.state.data;
            const { course_id } = this.props.course;
            await updateCourse(course_id, course);
            loadbar.stop();
            popup.show("success", "Course updated", "successfully");
            this.setState({ loading: false });
        } catch (ex) {
            loadbar.stop();
            popup.show("error", "Error", "Update failed");
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
            <div className="courseedit-form-container">
                <form className="courseedit-form">
                    <div className="courseedit-form-header">
                        <span className="courseedit-form-title">
                            Update your course:
                        </span>
                    </div>
                    <Link
                        className="courseedit-title-link"
                        to={`/course/${this.props.course.course_id}`}
                    >
                        {this.state.data.title}
                    </Link>
                    <label className="courseedit-title-label">Title</label>
                    {this.renderInput(
                        "title",
                        "Course Title",
                        "courseedit-title-inp"
                    )}
                    <label className="courseedit-outline-label">
                        Course Outline
                    </label>
                    {this.renderTextArea(
                        "outline",
                        "Course Outline",
                        "courseedit-outline-inp"
                    )}
                    <label className="courseedit-prerequisites-label">
                        Prerequisites
                    </label>
                    {this.renderTextArea(
                        "prerequisites",
                        "Prerequisites",
                        "courseedit-prerequisites-inp"
                    )}
                    <label className="courseedit-tags-label">Tags</label>
                    {this.renderInput("tags", "Tags", "courseedit-tags-inp")}
                    {this.renderSelectBox(
                        "language",
                        "Language",
                        "courseedit-language-select",
                        staticValues.languages.map(item => ({
                            value: item,
                            text: item
                        }))
                    )}
                    <label className="courseedit-length-label">
                        Length (Hours)
                    </label>
                    {this.renderInput(
                        "length",
                        "Length (Hours)",
                        "courseedit-length-inp"
                    )}
                    {this.renderSelectBox(
                        "difficulty",
                        "Difficulty",
                        "courseedit-difficulty-select",
                        staticValues.courseDifficulties.map(item => ({
                            value: item,
                            text: item
                        }))
                    )}
                    <label className="courseedit-fee-label">
                        Course Fee in USD
                    </label>
                    {this.renderInput(
                        "fee",
                        "Course Fee in USD",
                        "courseedit-fee-inp"
                    )}
                    {this.renderSelectBox(
                        "private",
                        "Access",
                        "courseedit-private",
                        [
                            { value: false, text: "Public" },
                            { value: true, text: "Private" }
                        ]
                    )}
                    {this.renderButton("Save", "courseedit-create-button")}
                </form>
            </div>
        );
    }
}

export default CourseEditForm;
