import React from "react";
import Form from "../Form";
import { deleteContent } from "../../../api/CoursesApi";
import $ from "jquery";
import "./ContentDeleteForm.css";

class ContentDeleteForm extends Form {
    state = {
        content: null,
        errors: "",
        loading: this.props.loading
    };

    componentDidMount() {
        this.toggleForm();
    }

    componentDidUpdate() {
        const { loading } = this.props;
        if (loading !== this.state.loading) {
            this.setState({ loading });
        }
    }

    toggleForm = () => {
        const className = ".condel-form";
        const headerClass = "condel-form-header";
        const confirmClass = "condel-confirm-container";

        if ($("." + confirmClass).css("display") !== "none") return;

        $(className)
            .children()
            .each(function() {
                const thisClass = $(this).attr("class");

                if (thisClass !== headerClass && thisClass !== confirmClass) {
                    $(this).slideToggle();
                }
            });
    };

    onSubmit = async e => {
        e.preventDefault();
        const className = ".condel-confirm-container";
        $(className).slideToggle();

        var { content } = this.state;
        if (content === null || content === "none") return;

        const {
            loadbar,
            popup,
            setLoading,
            match,
            setUpdateTrigger
        } = this.props;
        const course_id = match.params.id;

        try {
            setLoading();
            loadbar.start();
            this.setState({ errors: "" });
            await deleteContent(course_id, content);

            setUpdateTrigger();
            loadbar.stop();
            setLoading(false);
            popup.show("success", "Content", "Deleted");
        } catch (ex) {
            loadbar.stop();
            setLoading(false);
            popup.show("error", "Error", "Update unsuccessful");
            this.setState({ errors: ex.response.data.errors });
        }
    };

    onSelect = e => {
        e.preventDefault();
        const className = ".condel-select";
        const id = $(className).val();
        var { content, errors } = this.state;

        content = id;
        errors = "";
        this.setState({ content, errors });
    };

    showConfirmation = e => {
        e.preventDefault();
        const className = ".condel-confirm-container";

        if (this.state.content) $(className).slideToggle();
        else this.props.popup.show("info", "Select a content", "to delete");
    };

    cancelDelete = e => {
        e.preventDefault();
        const className = ".condel-confirm-container";
        $(className).slideToggle();
    };

    render() {
        return (
            <div className="condel-form-container">
                <form className="condel-form">
                    <div
                        className="condel-form-header"
                        onClick={this.toggleForm}
                    >
                        <span className="condel-form-title">
                            Delete a content
                        </span>
                    </div>
                    <div className="condel-select-container">
                        <label className="condel-select-label">
                            Select content
                        </label>
                        <select
                            className="condel-select"
                            onChange={this.onSelect}
                        >
                            <option value="none"></option>
                            {this.props.contents.map(content => (
                                <option
                                    key={content.content_id}
                                    value={content.content_id}
                                >
                                    {content.title}
                                </option>
                            ))}
                        </select>
                        <button
                            className="condel-delete-btn"
                            disabled={
                                this.state.loading ||
                                (this.state.errors !== "" &&
                                    this.state.errors !== null)
                            }
                            onClick={this.showConfirmation}
                        >
                            Delete
                        </button>
                        <p className="condel-form-error">{this.state.errors}</p>
                    </div>
                    <div className="condel-confirm-container">
                        <p className="condel-confirm-text">
                            Are you sure you want to delete this content?
                        </p>
                        <button
                            className="condel-delete-confirm"
                            disabled={
                                this.state.loading ||
                                (this.state.errors !== "" &&
                                    this.state.errors !== null)
                            }
                            onClick={this.onSubmit}
                        >
                            Delete
                        </button>
                        <button
                            className="condel-delete-cancel"
                            onClick={this.cancelDelete}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default ContentDeleteForm;
