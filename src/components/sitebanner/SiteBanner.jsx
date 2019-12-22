import React, { Component } from "react";
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

    componentDidMount() {
        this.slideImg(0);
    }

    slideImg = i => {
        var duration = 700;
        const middleClass = "." + this.images[1].classes;

        if (i === this.images.length) {
            i = 0;
            duration = 600;
            $(middleClass).css("visibility", "hidden");
        }
        if (i === 1) $(middleClass).css("visibility", "visible");

        const move = i * 650;
        const value = "-" + move.toString() + "px";
        const className = ".sitebanner-img-container";

        $(className).animate({ left: value }, duration, "swing");

        setTimeout(() => {
            this.slideImg(i + 1);
        }, 3000);
    };

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
                    <input
                        className="sitebanner-searchbox"
                        type="text"
                        placeholder="Search here"
                        onKeyUp={this.onKeyUp}
                    ></input>
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
            </div>
        );
    }
}

export default SiteBanner;
