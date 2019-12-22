import React, { Component } from "react";
import config from "../../config.json";
import staticValues from "../../staticValues.json";
import { updateCourseBanner } from "../../api/CoursesApi";
import $ from "jquery";
import "./CourseBannerEdit.css";

class CourseBannerEdit extends Component {
    state = {
        course: null,
        loading: false
    };

    filefield = React.createRef();

    componentDidMount() {
        const { course } = this.props;
        this.setState({ course });
    }

    onSubmit = async () => {
        const { loadbar, popup, course } = this.props;
        const { files } = this.filefield.current;

        if (files.length < 1) {
            popup.show("info", "Select an image", "to upload");
            return;
        }

        try {
            const banner = files[0];
            loadbar.start("Uploading");
            this.setState({ loading: true });
            const data = await updateCourseBanner(course.course_id, banner);
            loadbar.stop();
            this.setState({ loading: false });
            this.changeBanner(data.banner);
            popup.show("success", "Banner", "updated");
        } catch (ex) {
            loadbar.stop();
            this.setState({ loading: false });
            popup.show("error", "Error", "Something went wrong");
        }
    };

    removeBanner = async () => {
        const { loadbar, popup, course } = this.props;

        try {
            loadbar.start();
            this.setState({ loading: true });
            await updateCourseBanner(course.course_id, null);
            loadbar.stop();
            this.setState({ loading: false });
            this.changeBanner("");
            popup.show("success", "Banner", "removed");
        } catch (ex) {
            loadbar.stop();
            this.setState({ loading: false });
            popup.show("error", "Error", "Something went wrong");
        }
    };

    changeBanner = banner => {
        $(".courseedit-banner").attr("src", banner);
    };

    onChange = ({ currentTarget: input }) => {
        const labelClass = ".courseedit-banner-label";
        const { files } = this.filefield.current;

        if (files.length > 0) {
            $(labelClass).text(files[0].name);

            const errorMessage = this.validateField();
            if (errorMessage) {
                const classes = ".courseedit-error-text";
                $(classes).text(errorMessage);
                $(".courseedit-banner-btn").prop("disabled", true);
            } else {
                const classes = ".courseedit-error-text";
                $(classes).text("");
                $(".courseedit-banner-btn").prop("disabled", false);
            }
        } else $(labelClass).text("Select banner");
    };

    validateField = () => {
        const file = this.filefield.current.files[0];
        return this.validateImage(file);
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

    toggleAll = () => {
        $(".courseedit-banner-container").slideToggle();
        $(".courseedit-filefield-container").slideToggle();
        $(".courseedit-banner-btn").slideToggle();
        $(".courseedit-banner-remove-btn").slideToggle();
    };

    render() {
        const { course } = this.state;
        const { defaultCourseBanner } = staticValues.images;
        return course ? (
            <React.Fragment>
                <div
                    className="courseedit-banner-title"
                    onClick={this.toggleAll}
                >
                    <i className="material-icons courseedit-minimize-icon">
                        open_in_new
                    </i>
                    <label className="courseedit-banner-title-text">
                        Update course banner
                    </label>
                </div>
                <div className="courseedit-banner-container">
                    <img
                        className="courseedit-banner"
                        src={
                            course.banner ? course.banner : defaultCourseBanner
                        }
                        alt=""
                    />
                </div>
                <div className="courseedit-filefield-container">
                    <div
                        className="courseedit-banner-label-container"
                        onClick={() => {
                            $(".courseedit-banner-inp").click();
                        }}
                    >
                        <i className="material-icons banner-upload-icon">
                            photo_library
                        </i>
                        <label
                            htmlFor="courseedit-banner-inp"
                            className="courseedit-banner-label"
                        >
                            Select banner
                        </label>
                    </div>
                    <input
                        type="file"
                        name="courseedit-banner-inp"
                        className="courseedit-banner-inp"
                        onChange={this.onChange}
                        ref={this.filefield}
                    />
                    <div className="courseedit-error-container">
                        <p className="courseedit-error-text"></p>
                    </div>
                </div>
                <button
                    className="courseedit-banner-btn"
                    onClick={this.onSubmit}
                    disabled={this.state.loading}
                >
                    Upload
                </button>
                <button
                    className="courseedit-banner-remove-btn"
                    onClick={this.removeBanner}
                    disabled={this.state.loading}
                >
                    Remove
                </button>
            </React.Fragment>
        ) : null;
    }
}

export default CourseBannerEdit;
