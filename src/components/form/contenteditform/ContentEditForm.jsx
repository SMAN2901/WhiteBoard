import React from "react";
import { Redirect } from "react-router-dom";
import Form from "../Form";
import Joi from "joi-browser";
import $ from "jquery";
import { isAuthenticated } from "../../../api/AuthApi";
import { editContent } from "../../../api/CoursesApi";
import "./ContentEditForm.css";

class ContentEditForm extends Form {
    state = {
        contents: [],
        index: 0,
        data: {
            title: this.props.contents[0].title,
            description: this.props.contents[0].description
        },
        errors: {},
        loading: this.props.loading
    };

    _isMounted = false;

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
            .label("Description")
    };

    componentDidMount() {
        this._isMounted = true;
        const { loadbar, contents } = this.props;
        loadbar.stop();
        if (this._isMounted) {
            this.setState({ contents });
            /*if (contents.length > 0) {
                const { title, description } = contents[0];
                const data = { title, description };
                this.setState({ data });
            }*/
        }
        this.toggleForm();
    }

    componentDidUpdate() {
        const { loading, contents } = this.props;
        if (
            loading !== this.state.loading ||
            contents !== this.state.contents
        ) {
            if (this._isMounted) this.setState({ loading, contents });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    submitForm = async () => {
        const { loadbar, popup, setLoading, setUpdateTrigger } = this.props;

        try {
            setLoading();
            loadbar.start();
            const { data, contents, index } = this.state;
            const { id } = this.props.match.params;
            const { content_id } = contents[index];

            await editContent(id, content_id, data);

            setUpdateTrigger();
            loadbar.stop();
            popup.show("success", "Content updated", "successfully");
            setLoading(false);
        } catch (ex) {
            loadbar.stop();
            popup.show("error", "Error", "Update failed");
            setLoading(false);
        }
    };

    validateField = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);

        return error ? error.details[0].message : null;
    };

    toggleForm = () => {
        const className = ".cedit-form";
        const headerClass = "cedit-form-header";

        $(className)
            .children()
            .each(function() {
                const thisClass = $(this).attr("class");

                if (thisClass !== headerClass) {
                    $(this).slideToggle();
                }
            });
    };

    onContentSelect = e => {
        const { contents } = this.state;
        const index = e.target.value;
        const data = {
            title: contents[index].title,
            description: contents[index].description
        };
        this.setState({ index, data });
    };

    render() {
        const { contents } = this.state;

        return !isAuthenticated() ? (
            <Redirect to="/" />
        ) : (
            <div className="cedit-form-container">
                <form className="cedit-form">
                    <div
                        className="cedit-form-header"
                        onClick={this.toggleForm}
                    >
                        <span className="cedit-form-title">Update Content</span>
                    </div>
                    <select
                        className="cedit-select"
                        onChange={this.onContentSelect}
                    >
                        {contents.map((content, i) => (
                            <option value={i} key={i}>
                                {content.title}
                            </option>
                        ))}
                    </select>
                    {this.renderInput("title", "Title", "cedit-title-inp")}
                    {this.renderTextArea(
                        "description",
                        "Description",
                        "cedit-description-inp"
                    )}
                    {this.renderButton("Save", "cedit-save-button")}
                </form>
            </div>
        );
    }
}

export default ContentEditForm;
