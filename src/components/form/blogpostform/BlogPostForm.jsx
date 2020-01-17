import React from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "../Form";
import { createPost } from "../../../api/BlogApi";
import staticValues from "../../../staticValues.json";
import config from "../../../config.json";
import Joi from "joi-browser";
import "./BlogPostForm.css";
import { isAuthenticated } from "../../../api/AuthApi";

class BlogPostForm extends Form {
    state = {
        data: {
            title: "",
            description: "",
            banner: "",
            tags: ""
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
        description: Joi.string()
            .trim()
            .min(30)
            .max(10000)
            .required()
            .label("Body"),
        tags: Joi.string().label("Tags"),
        banner: Joi.any().label("Banner")
    };

    submitForm = async () => {
        const { loadbar, popup, setUpdateTrigger } = this.props;

        loadbar.start("Posting");
        try {
            this.setState({ loading: true });
            const post = this.state.data;
            const banner = this.filefield.current.files[0];
            const response = await createPost(post, banner);
            setUpdateTrigger();
            loadbar.stop();
            popup.show("success", "Posted", "successfully");
            this.props.history.push("/blog/post/" + response.data);
        } catch (ex) {
            loadbar.stop();
            popup.show("error", "Error", "Couldn't post");
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
        const { defaultBlogBanner } = staticValues.images;

        return !isAuthenticated() ? (
            <Redirect to="/blog" />
        ) : (
            <div className="bp-form-div">
                <Link to="/blog" className="bp-form-toplink">
                    <i className="material-icons bp-form-toplink-icon">
                        menu_open
                    </i>
                    <p className="bp-form-toplink-text">View Recent Blogs</p>
                </Link>
                <div className="bp-form-container">
                    <div className="bp-form-banner-container">
                        <img
                            src={defaultBlogBanner}
                            alt=""
                            className="bp-form-banner"
                        ></img>
                    </div>
                    <form className="bp-form">
                        <p className="bp-form-title">Write a new blog entry</p>
                        {this.renderInput("title", "Title", "bp-title-inp")}
                        {this.renderTextArea(
                            "description",
                            "Body",
                            "bp-body-inp"
                        )}
                        {this.renderFileField(
                            "banner",
                            "Select banner",
                            "bp-banner-filefield",
                            "bp-banner-filefield-label",
                            this.filefield,
                            this.filefield_label
                        )}
                        {this.renderInput("tags", "Tags", "bp-tags-inp")}
                        {this.renderButton("Post", "bp-post-btn")}
                    </form>
                </div>
            </div>
        );
    }
}

export default BlogPostForm;
