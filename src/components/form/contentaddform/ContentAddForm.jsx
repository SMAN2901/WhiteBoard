import React from "react";
import { Redirect } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import $ from "jquery";
import { isAuthenticated } from "../../../api/AuthApi";
import { addContent } from "../../../api/CoursesApi";
import config from "../../../config.json";
import "./ContentAddForm.css";

class ContentAddForm extends Form {
    state = {
        data: {
            title: "",
            description: "",
            file: "",
            file_type: this.props.type
        },
        errors: {},
        loading: this.props.loading
    };

    initialState = {
        data: {
            title: "",
            description: "",
            file: "",
            file_type: this.props.type
        },
        errors: {}
    };

    schema = {
        title: Joi.string()
            .trim()
            .min(5)
            .max(100)
            .required()
            .label("Title"),
        description: Joi.string()
            .trim()
            .min(5)
            .max(500)
            .required()
            .label("Description"),
        file: Joi.any().label("File"),
        file_type: Joi.boolean().required()
    };

    componentDidMount() {
        const { loadbar } = this.props;
        loadbar.stop();
        this.toggleForm();
    }

    componentDidUpdate() {
        const { loading } = this.props;
        if (loading !== this.state.loading) {
            this.setState({ loading });
        }
    }

    initState = () => {
        const { data, errors } = this.initialState;
        this.setState({ data, errors });
    };

    submitForm = async () => {
        const { loadbar, popup, setLoading, setUpdateTrigger } = this.props;

        try {
            setLoading();
            loadbar.start();
            this.toggleProgressBar();
            const { data } = this.state;
            const file = this.filefield.current.files[0];
            const { id } = this.props.match.params;

            await addContent(id, data, file, this.onUploadProgress);

            setUpdateTrigger();
            loadbar.stop();
            this.toggleProgressBar();
            popup.show("success", "Course updated", "successfully");
            this.initState();
            setLoading(false);
        } catch (ex) {
            loadbar.stop();
            this.toggleProgressBar();
            popup.show("error", "Error", "Update failed");
            setLoading(false);
        }
    };

    validateField = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        if (name === "file") {
            const file = this.filefield.current.files[0];
            return this.validateFile(file);
        }

        return error ? error.details[0].message : null;
    };

    validateFile = file => {
        const { maxFileSize, videoTypes } = config.validation;

        if (file.size > maxFileSize) {
            return "File is too large.";
        }

        if (this.props.type) {
            if (!videoTypes.includes(file.type)) {
                return "Selected file is not an mp4 video";
            }
        }

        return null;
    };

    filefield = React.createRef();
    filefield_label = React.createRef();

    toggleForm = () => {
        const type = this.props.type.toString();
        const className = ".content-form-" + type;
        const headerClass = "content-form-header";
        const progClass = "content-upload-bar content-upload-bar-" + type;

        $(className)
            .children()
            .each(function() {
                const thisClass = $(this).attr("class");

                if (thisClass !== headerClass && thisClass !== progClass) {
                    $(this).slideToggle();
                }
            });
    };

    toggleProgressBar = () => {
        const type = this.props.type.toString();
        const className = ".content-upload-bar-" + type;
        const progClass = ".content-upload-progress-" + type;
        const visibility = $(className).css("visibility");
        const value = visibility === "hidden" ? "visible" : "hidden";

        $(progClass).css("width", "0%");
        $(className).css("visibility", value);
    };

    onUploadProgress = e => {
        const { files } = this.filefield.current;
        const fileSize = files.length > 0 ? files[0].size : 0;
        const percentage = Math.floor((e.loaded * 100) / fileSize);
        const width = percentage.toString() + "%";
        const type = this.props.type.toString();
        const progClass = ".content-upload-progress-" + type;

        $(progClass).animate({ width }, 500);
    };

    render() {
        const type = this.props.type.toString();

        return !isAuthenticated() ? (
            <Redirect to="/" />
        ) : (
            <div className="content-form-container">
                <form className={`content-form content-form-${type}`}>
                    <div
                        className="content-form-header"
                        onClick={this.toggleForm}
                    >
                        <span className="content-form-title">
                            {this.props.type
                                ? "Add a new content"
                                : "Upload course material"}
                        </span>
                    </div>
                    {this.renderInput("title", "Title", "content-title-inp")}
                    {this.renderTextArea(
                        "description",
                        "Description",
                        "content-description-inp"
                    )}
                    {this.renderFileField(
                        "file",
                        "Select file",
                        "content-filefield",
                        "content-filefield-label",
                        this.filefield,
                        this.filefield_label
                    )}
                    <div
                        className={`content-upload-bar content-upload-bar-${type}`}
                    >
                        <div
                            className={`content-upload-progress content-upload-progress-${type}`}
                        >
                            <div className="content-upload-bar-color"></div>
                        </div>
                    </div>
                    {this.renderButton("Upload", "content-add-button")}
                </form>
            </div>
        );
    }
}

export default ContentAddForm;
