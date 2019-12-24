import React, { Component } from "react";
import { Link } from "react-router-dom";
import staticValues from "../../staticValues.json";
import $ from "jquery";
import "./CategoryList.css";

class CategoryList extends Component {
    componentDidMount() {
        document.addEventListener("click", this.onClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.onClick);
    }

    onClick = e => {
        const categoryClass = "course-category-div";
        const categoryIcon = "sitebanner-category-icon";
        const display = $(".sitebanner-course-category").css("display");
        var classes = $(e.target).attr("class");

        if (typeof classes === "undefined") {
            if (display !== "none") {
                this.props.toggleCategories();
            }
            return;
        }
        classes = classes.split(" ");

        const n = classes.length;
        const len =
            n > 0
                ? $("." + categoryClass).find("." + classes[n - 1]).length
                : 0;

        if (
            classes[n - 1] !== categoryClass &&
            classes[n - 1] !== categoryIcon &&
            len === 0 &&
            display !== "none"
        ) {
            this.props.toggleCategories();
        }
    };

    render() {
        const categories = staticValues.courseCategories;

        return (
            <div className="course-category-div">
                <div className="course-category-list">
                    <div className="course-category-list-header-container">
                        <div>
                            <i className="material-icons course-category-list-header-icon">
                                apps
                            </i>
                            <label className="course-category-list-header-text">
                                Categories
                            </label>
                        </div>
                        <i
                            className="material-icons course-category-list-close-icon"
                            onClick={this.props.toggleCategories}
                        >
                            close
                        </i>
                    </div>
                    {categories.map(category => (
                        <Link
                            key={category.name}
                            to={`/course/category/${category.name}`}
                            onClick={this.props.toggleCategories}
                        >
                            <div className="course-category-container">
                                <i className="material-icons course-category-icon">
                                    {category.icon}
                                </i>
                                <label className="course-category-name">
                                    {category.name}
                                </label>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }
}

export default CategoryList;
