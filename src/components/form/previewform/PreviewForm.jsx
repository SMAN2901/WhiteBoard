import React from "react";
import { Link } from "react-router-dom";
import Form from "../Form";
import { setPreview } from "../../../api/CoursesApi";
import $ from "jquery";
import "./PreviewForm.css";

class PreviewForm extends Form {
    state = {
        preview: [],
        errors: "",
        loading: this.props.loading
    };

    componentDidMount() {
        this.toggleForm();
        var preview = [];
        const { contents } = this.props;

        if (contents !== "pending") {
            for (var i = 0; i < contents.length; i++) {
                if (contents[i].preview) {
                    preview.push(contents[i].content_id);
                }
            }

            this.setState({ preview });
        }
    }

    componentDidUpdate() {
        const { loading } = this.props;
        if (loading !== this.state.loading) {
            this.setState({ loading });
        }
    }

    toggleForm = () => {
        const className = ".prev-form";
        const headerClass = "prev-form-header";

        $(className)
            .children()
            .each(function() {
                const thisClass = $(this).attr("class");

                if (thisClass !== headerClass) {
                    $(this).slideToggle();
                }
            });
    };

    onSubmit = async e => {
        e.preventDefault();
        var { preview } = this.state;
        const { loadbar, popup, setLoading, match } = this.props;
        const course_id = match.params.id;

        setLoading();
        loadbar.start();
        this.setState({ errors: "" });

        const response = await setPreview(course_id, preview);

        if (response) {
            loadbar.stop();
            setLoading(false);
            if (response.success) popup.show("success", "Update", "Successful");
            else {
                popup.show("error", "Error", "Update unsuccessful");
                this.setState({ errors: response.errors });
            }
        }
    };

    onSelect = e => {
        e.preventDefault();
        const className = ".prev-prev-select";
        const id = $(className).val();
        var { preview, errors } = this.state;

        preview.push(id);
        preview.sort((id1, id2) => this.getSerial(id1) - this.getSerial(id2));
        errors = "";
        this.setState({ preview, errors });
    };

    onPrevRemove = id => {
        var { preview, errors } = this.state;
        const index = preview.indexOf(id);

        if (index > -1) {
            preview.splice(index, 1);
        }
        errors = "";

        this.setState({ preview, errors });
    };

    getPrevCandidates = () => {
        var a = [];
        const { preview } = this.state;
        const { contents } = this.props;

        for (var i = 0; i < contents.length; i++) {
            if (
                contents[i].file_type &&
                contents[i].prerequisites === null &&
                preview.indexOf(contents[i].content_id) === -1
            ) {
                a.push(contents[i]);
            }
        }

        return a;
    };

    getSerial = id => {
        const { contents } = this.props;

        for (var i = 0; i < contents.length; i++) {
            if (contents[i].content_id === id) {
                return contents[i].serial;
            }
        }

        return -1;
    };

    getSelectedContents = () => {
        var a = [];
        const { contents } = this.props;
        const { preview } = this.state;

        if (contents !== "pending") {
            for (var i = 0; i < contents.length; i++) {
                if (preview.indexOf(contents[i].content_id) !== -1) {
                    a.push(contents[i]);
                }
            }
        }

        return a;
    };

    render() {
        const preview = this.getSelectedContents();

        return (
            <div className="prev-form-container">
                <form className="prev-form">
                    <div className="prev-form-header" onClick={this.toggleForm}>
                        <span className="prev-form-title">Set preview</span>
                    </div>
                    <div className="prev-select-container">
                        <label className="prev-prev-label">
                            Select content
                        </label>
                        <select className="prev-prev-select">
                            {this.getPrevCandidates().map(content => (
                                <option
                                    key={content.content_id}
                                    value={content.content_id}
                                >
                                    {content.title}
                                </option>
                            ))}
                        </select>
                        <button
                            className="prev-add-btn"
                            onClick={this.onSelect}
                            disabled={
                                this.state.loading ||
                                (this.state.errors !== "" &&
                                    this.state.errors !== null)
                            }
                        >
                            Add
                        </button>
                    </div>
                    <div className="prev-selected-container">
                        <label className="prev-selected-label">
                            {this.state.preview.length > 0
                                ? "Preview"
                                : "No preview"}
                        </label>
                        {preview.map(content => (
                            <React.Fragment key={content.content_id}>
                                <div className="prev-selected">
                                    <Link
                                        to={`/content/${content.course_id}/${content.content_id}`}
                                    >
                                        <i className="material-icons prev-selected-icon">
                                            open_in_new
                                        </i>
                                    </Link>
                                    <span className="prev-selected-text">
                                        {content.title}
                                    </span>
                                    <i
                                        className="material-icons prev-selected-delete-icon"
                                        onClick={() => {
                                            this.onPrevRemove(
                                                content.content_id
                                            );
                                        }}
                                    >
                                        clear
                                    </i>
                                </div>
                            </React.Fragment>
                        ))}
                        <p className="prev-selected-error-msg">
                            {this.state.errors}
                        </p>
                        <button
                            className="prev-save-btn"
                            onClick={this.onSubmit}
                            disabled={
                                this.state.loading ||
                                (this.state.errors !== "" &&
                                    this.state.errors !== null)
                                    ? true
                                    : false
                            }
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default PreviewForm;
