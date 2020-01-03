import React from "react";
import { Link } from "react-router-dom";
import Form from "../Form";
import { setPrerequisites } from "../../../api/CoursesApi";
import $ from "jquery";
import "./PrerequisiteForm.css";

class PrerequisiteForm extends Form {
    state = {
        index: 0,
        prerequisites: [],
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
        const className = ".preq-form";
        const headerClass = "preq-form-header";

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
        var prerequisites = [];
        var { index } = this.state;
        const { contents, loadbar, popup, setLoading } = this.props;
        const { content_id, course_id } = contents[index];

        this.state.prerequisites.forEach(i => {
            prerequisites.push(contents[i].content_id);
        });

        setLoading();
        loadbar.start();
        this.setState({ errors: "" });

        const data = { content_id, prerequisites };
        const response = await setPrerequisites(course_id, data);

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
        const id = e.target.value;
        const index = this.getIndex(id);
        const { contents } = this.props;
        const prerequisites = [];
        const errors = "";

        if (contents[index].prerequisites) {
            for (var i = 0; i < contents[index].prerequisites.length; i++) {
                var j = this.getIndex(contents[index].prerequisites[i]);
                prerequisites.push(j);
            }
        }
        prerequisites.sort((a, b) => a - b);

        this.setState({ index, prerequisites, errors });
    };

    onPreqSelect = e => {
        e.preventDefault();
        const className = ".preq-preq-select";
        const id = $(className).val();
        const index = this.getIndex(id);
        var { prerequisites, errors } = this.state;

        prerequisites.push(index);
        prerequisites.sort((a, b) => a - b);
        errors = "";
        this.setState({ prerequisites, errors });
    };

    onPreqRemove = i => {
        var { prerequisites, errors } = this.state;
        const index = prerequisites.indexOf(i);

        if (index > -1) {
            prerequisites.splice(index, 1);
        }
        errors = "";

        this.setState({ prerequisites, errors });
    };

    getPreqCandidates = () => {
        var a = [];
        var b = [];
        const { contents } = this.props;
        const { index, prerequisites } = this.state;

        for (var k = 0; k < contents.length; k++) {
            if (contents[k].serial >= contents[index].serial) b.push(false);
            else b.push(true);
        }

        if (contents[index].prerequisites) {
            for (var i = 0; i < contents[index].prerequisites.length; i++) {
                var j = this.getIndex(contents[index].prerequisites[i]);
                b[j] = false;
            }
        }

        for (i = 0; i < prerequisites.length; i++) {
            b[prerequisites[i]] = false;
        }

        for (i = 0; i < contents.length; i++) {
            if (b[i]) a.push(contents[i]);
        }

        return a;
    };

    getIndex = id => {
        const { contents } = this.props;

        for (var i = 0; i < contents.length; i++) {
            if (contents[i].content_id === id) {
                return i;
            }
        }

        return -1;
    };

    render() {
        const { contents } = this.props;

        return (
            <div className="preq-form-container">
                <form className="preq-form">
                    <div className="preq-form-header" onClick={this.toggleForm}>
                        <span className="preq-form-title">
                            Set prerequisites
                        </span>
                    </div>
                    <div className="preq-select-container">
                        <label className="preq-content-label">
                            Select content
                        </label>
                        <select
                            className="preq-content-select"
                            onChange={this.onSelect}
                        >
                            {contents.map(content => (
                                <option
                                    key={content.content_id}
                                    value={content.content_id}
                                >
                                    {content.title}
                                </option>
                            ))}
                        </select>
                        <label className="preq-preq-label">
                            Select prerequisite
                        </label>
                        <select className="preq-preq-select">
                            {this.getPreqCandidates().map(content => (
                                <option
                                    key={content.content_id}
                                    value={content.content_id}
                                >
                                    {content.title}
                                </option>
                            ))}
                        </select>
                        <button
                            className="preq-add-btn"
                            onClick={this.onPreqSelect}
                            disabled={
                                this.state.loading ||
                                (this.state.errors !== "" &&
                                    this.state.errors !== null)
                            }
                        >
                            Add
                        </button>
                    </div>
                    <div className="preq-selected-container">
                        <label className="preq-selected-label">
                            {this.state.prerequisites.length > 0
                                ? "Selected"
                                : "No prerequisites for this content"}
                        </label>
                        {this.state.prerequisites.map(i => (
                            <React.Fragment key={i}>
                                <div className="preq-selected">
                                    <Link
                                        to={`/content/${contents[i].course_id}/${contents[i].content_id}`}
                                    >
                                        <i className="material-icons preq-selected-icon">
                                            open_in_new
                                        </i>
                                    </Link>
                                    <span className="preq-selected-text">
                                        {contents[i].title}
                                    </span>
                                    <i
                                        className="material-icons preq-selected-delete-icon"
                                        onClick={() => {
                                            this.onPreqRemove(i);
                                        }}
                                    >
                                        clear
                                    </i>
                                </div>
                            </React.Fragment>
                        ))}
                        <p className="preq-selected-error-msg">
                            {this.state.errors}
                        </p>
                        <button
                            className="preq-save-btn"
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

export default PrerequisiteForm;
