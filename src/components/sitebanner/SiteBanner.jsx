import React, { Component } from "react";
import { shuffleArray } from "../../services/util";
import $ from "jquery";
import "./SiteBanner.css";

class SiteBanner extends Component {
    animate = true;
    fun = null;

    images = shuffleArray([
        {
            classes: "sitebanner-img1",
            src: "/assets/images/banner01.png"
        },
        {
            classes: "sitebanner-img2",
            src: "/assets/images/banner02.png"
        },
        {
            classes: "sitebanner-img3",
            src: "/assets/images/banner03.png"
        }
    ]);

    componentDidMount() {
        this.toggleImg(0);
        window.addEventListener("focus", this.onFocus);
        window.addEventListener("blur", this.onBlur);
    }

    componentWillUnmount() {
        this.animate = false;
        clearTimeout(this.fun);
        window.removeEventListener("focus", this.onFocus);
        window.removeEventListener("blur", this.onBlur);
    }

    onFocus = () => {
        this.hideAll();
        this.animate = true;
        this.toggleImg(0);
    };

    onBlur = () => {
        this.animate = false;
        clearTimeout(this.fun);
        this.hideAll();
        var classes = "." + this.images[0].classes;
        $(classes).css("display", "inline");
    };

    toggleImg = i => {
        if (i === this.images.length) i = 0;
        var classes = "." + this.images[i].classes;
        $(classes).toggle("width");
        if (this.animate) {
            this.fun = setTimeout(() => {
                $(classes).toggle("width");
                this.toggleImg(i + 1);
            }, 3000);
        } else this.hideAll();
    };

    hideAll = () => {
        this.images.forEach(img => {
            var classes = "." + img.classes;
            $(classes).css("display", "none");
        });
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
                    {this.images.map(item => (
                        <img
                            key={item.classes}
                            className={"sitebanner-img " + item.classes}
                            src={item.src}
                            alt=""
                        ></img>
                    ))}
                </div>
                <div className="searchbox-container">
                    <label className="sitebanner-searchbox-label">
                        Need to learn something?
                    </label>
                    <input
                        className="sitebanner-searchbox"
                        type="text"
                        placeholder="Search here"
                    ></input>
                    <span className="sitebanner-text">
                        <i className="material-icons sitebanner-icons">
                            record_voice_over
                        </i>
                        Teach on WhiteBoard
                    </span>
                    <br></br>
                    <br></br>
                    <span className="sitebanner-text">
                        <i className="material-icons sitebanner-icons">share</i>
                        Share your knowledge
                    </span>
                    <br></br>
                    <br></br>
                    <span className="sitebanner-text">
                        <i className="material-icons sitebanner-icons">
                            school
                        </i>
                        Make learning easy!
                    </span>
                </div>
            </div>
        );
    }
}

export default SiteBanner;
