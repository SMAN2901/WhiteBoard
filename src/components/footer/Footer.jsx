import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
    render() {
        return (
            <div className="footer-container">
                <p>Developed and maintained by</p>
                <span>Sadman Rizwan</span>
                <span>and</span>
                <span>Minhajul Islam</span>
            </div>
        );
    }
}

export default Footer;
