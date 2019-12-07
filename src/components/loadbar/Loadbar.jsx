import React, { Component } from "react";
import "./Loadbar.css";

class Loadbar extends Component {
    render() {
        const { loadbar, popup } = this.props;
        const popupProp = {
            color: {
                success: "rgb(0, 158, 0)",
                error: "rgb(255, 43, 43)",
                warning: "rgb(255, 153, 0)",
                info: "rgb(0, 119, 255)"
            },
            icon: {
                success: "check_circle",
                error: "error",
                warning: "warning",
                info: "info"
            }
        };

        return (
            <div className="popup-div">
                {popup.display ? (
                    <React.Fragment>
                        <div
                            className="popup-container"
                            style={{
                                borderLeft: `10px solid ${
                                    popupProp.color[popup.type]
                                }`
                            }}
                        >
                            <div className="popup-icon-container">
                                <i
                                    className="material-icons popup-icon"
                                    style={{
                                        color: popupProp.color[popup.type]
                                    }}
                                >
                                    {popupProp.icon[popup.type]}
                                </i>
                            </div>
                            <div className="popup-text-container">
                                <span className="loadbar-text">
                                    {popup.text}
                                </span>
                                <br></br>
                                <span className="popup-text loadbar-subtext">
                                    {popup.subtext}
                                </span>
                            </div>
                        </div>
                        <br></br>
                    </React.Fragment>
                ) : null}
                {loadbar.display ? (
                    <div className="loadbar-container">
                        <div className="loadbar-icon-container">
                            <i className="material-icons loadbar-icon">
                                donut_large
                            </i>
                        </div>
                        <div className="loadbar-text-container">
                            <span className="loadbar-text">{loadbar.text}</span>
                            <br></br>
                            <span className="loadbar-text loadbar-subtext">
                                {loadbar.subtext}
                            </span>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Loadbar;
