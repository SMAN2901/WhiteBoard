import React, { Component } from "react";
import CategoryList from "../categorylist/CategoryList";
import { shuffleArray } from "../../services/util";
import staticValues from "../../staticValues.json";
import $ from "jquery";
import "./SiteBanner.css";

class SiteBanner extends Component {
    images = shuffleArray(
        staticValues.images.siteBanners.map((img, index) => ({
            classes: "sitebanner" + index.toString(),
            src: img
        }))
    );

    onKeyUp = e => {
        if (e.keyCode === 13) {
            e.target.blur();
            const searchString = e.target.value.trim();

            if (searchString.length > 0) {
                const url = "/search/course/" + searchString;
                this.props.history.push(url);
            }
        }
    };

    toggleCategories = () => {
        const className = ".sitebanner-course-category";
        $(className).slideToggle();
    };

    render() {
        return (
            <div className="sitebanner-container">
                <div className="wallp-container">
                    <img
                        className="wallp-img"
                        src={this.images[0].src}
                        alt=""
                    ></img>
                </div>
                <div className="image-container">
                    <div className="sitebanner-img-container">
                        {this.images.map(item => (
                            <img
                                key={item.classes}
                                className={"sitebanner-img " + item.classes}
                                src={item.src}
                                alt=""
                            ></img>
                        ))}
                    </div>
                </div>
                <div className="searchbox-container">
                    <label className="sitebanner-searchbox-label">
                        Need to learn something?
                    </label>
                    <div className="sitebanner-searchbox-container">
                        <i
                            className="material-icons sitebanner-category-icon"
                            onClick={this.toggleCategories}
                        >
                            apps
                        </i>
                        <input
                            className="sitebanner-searchbox"
                            type="text"
                            placeholder="Search here"
                            onKeyUp={this.onKeyUp}
                        ></input>
                    </div>
                    <div className="sitebanner-text-container">
                        <i className="material-icons sitebanner-icons">
                            record_voice_over
                        </i>
                        <p className="sitebanner-text">Teach on WhiteBoard</p>
                    </div>
                    <div className="sitebanner-text-container">
                        <i className="material-icons sitebanner-icons">share</i>
                        <p className="sitebanner-text">Share your knowledge</p>
                    </div>
                    <div className="sitebanner-text-container">
                        <i className="material-icons sitebanner-icons">
                            school
                        </i>
                        <p className="sitebanner-text">Make learning easy</p>
                    </div>
                </div>
                <div className="sitebanner-course-category">
                    <CategoryList
                        {...this.props}
                        toggleCategories={this.toggleCategories}
                    />
                </div>
            </div>
        );
    }
}

export default SiteBanner;
