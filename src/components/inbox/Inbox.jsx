import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import staticValues from "../../staticValues.json";
import { getMessages, sendMessage } from "../../api/chatApi";
import { isAuthenticated, getCurrentUser } from "../../api/AuthApi";
import $ from "jquery";
import "jquery.nicescroll";
import "./Inbox.css";

class Inbox extends Component {
    state = {
        inbox: {
            not_seen: 0,
            inbox: []
        },
        messages: {
            user_info: null,
            messages: []
        },
        current: 0,
        loading: false,
        key: 0
    };

    _isMounted = false;
    lastUpdated = -1;
    minDelay = 200;
    lastWidth = $(window).width();
    msgLoaded = false;

    componentDidMount() {
        this._isMounted = true;
        const { inbox } = this.props;
        var { username } = this.props.match.params;
        if (typeof username !== "undefined") {
            var u = getCurrentUser();
            var uname = u ? u.username : null;
            if (uname !== username) this.setState({ current: -1 });
        }
        this.setState({ inbox });
        this.fetchMessages();
        window.addEventListener("resize", this.setHeight);
        window.addEventListener("resize", this.fixDivs);
    }

    async componentDidUpdate() {
        const { inbox } = this.props;

        if (this._isMounted && inbox !== this.state.inbox) {
            await this.setState({ inbox });
            this.fetchMessages();
        }
        if (
            this._isMounted &&
            this.state.inbox.inbox.length > 0 &&
            this.state.messages.user_info === null
        ) {
            this.fetchMessages();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.setHeight);
        window.removeEventListener("resize", this.fixDivs);
        this._isMounted = false;
    }

    fetchMessages = async change => {
        const { current } = this.state;
        const { inbox } = this.state.inbox;

        if (inbox.length > 0) {
            var { username } =
                current < 0
                    ? this.props.match.params
                    : inbox[current].user_info;

            if (change) {
                this.setState({
                    messages: {
                        user_info: null,
                        messages: []
                    }
                });
            }

            const { loadbar } = this.props;

            try {
                if (change) loadbar.start();
                const messages = await getMessages(username);
                this.setState({ messages });
                loadbar.stop();
            } catch (ex) {
                loadbar.stop();
            }
        }
    };

    sendText = async () => {
        const inpClass = ".inbox-inp";
        const text = $(inpClass)
            .val()
            .trim();
        const { current, inbox } = this.state;

        if (text.length < 1 || inbox.inbox.length < 1 || this.state.loading)
            return;

        const to_user = inbox.inbox[current].user_info.username;
        const data = { text, to_user };
        const { popup } = this.props;

        try {
            this.setState({ loading: true });
            await sendMessage(data);
            this.setState({ loading: false });
            $(inpClass).val("");
        } catch (ex) {
            popup.show("error", "Sending", "Failed");
            this.setState({ loading: false });
        }
    };

    onKeyDown = e => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            this.sendText();
        }
    };

    getHeight = () => {
        var delta = 115;
        if ($(".navbarx-container").css("display") !== "none") {
            delta += 45;
        }
        var h = $(window).height() - delta;
        return h.toString() + "px";
    };

    setHeight = () => {
        var h = this.getHeight();
        $(".inbox-left, .inbox-right").css("height", h);
    };

    fixDivs = () => {
        var time = Date.now();
        var { key } = this.state;

        if (
            (this.lastUpdated === -1 ||
                time - this.lastUpdated >= this.minDelay) &&
            this.lastWidth !== $(window).width()
        ) {
            this.lastUpdated = Date.now();
            this.lastWidth = $(window).width();
            key++;
            this.setState({ key });
        }
    };

    addScrollbarStyle = () => {
        var style = {
            cursorcolor: "rgba(255,255,255,0.5)",
            cursorborder: "0px",
            cursorborderradius: "2px",
            horizrailenabled: false,
            zindex: 0
        };

        $(".inbox-left").niceScroll(style);

        style.cursorcolor = "gray";
        style.cursorborder = "1px solid white";
        $(".inbox-messages").niceScroll(style);

        this.scrollToBottom();
    };

    scrollToBottom = () => {
        const height = $(".inbox-messages").height() + 1000;
        //$(".inbox-messages").animate({ scrollTop: height }, 500);
        $(".inbox-messages").scrollTop(height);
    };

    toggleInfo = () => {
        const left = ".inbox-left";
        const right = ".inbox-right";
        const width = $(left).css("width");
        const icon = $(".inbox-header-icon").text();
        const newIcon =
            "keyboard_arrow_" +
            (icon === "keyboard_arrow_left" ? "right" : "left");
        const w = $(".inbox-container").css("width");
        const ww = parseInt(w.substring(0, w.length - 2));

        if (width === "270px") {
            const newWidth = (ww - 50).toString() + "px";
            $(".inbox-info-text").css("display", "none");
            $(right).animate({ width: newWidth });
            $(left).animate({ width: "50px" }, () => {
                $(".inbox-header-icon").text(newIcon);
            });
        } else {
            const newWidth = (ww - 270).toString() + "px";
            $(right).animate({ width: newWidth });
            $(left).animate({ width: "270px" }, () => {
                $(".inbox-info-text").css("display", "inline-block");
                $(".inbox-header-icon").text(newIcon);
            });
        }
    };

    onSelectUser = async i => {
        const x = this.state.current;

        if (x === i) await this.fetchMessages();
        else {
            await this.setState({ current: i });
            await this.fetchMessages(true);
        }
    };

    renderInfo = (data, i) => {
        var { text, user_info, seen } = data;
        var { name, username, profile_pic } = user_info;
        var { defaultProfileImage } = staticValues.images;
        var className = "inbox-info";

        if (profile_pic === null) profile_pic = defaultProfileImage;
        if (!seen) className += " inbox-info-unseen";
        if (this.state.current === -1) {
            var user = this.props.match.params.username;
            if (user === username) this.setState({ current: i });
        }
        if (this.state.current === i) className += " inbox-info-selected";

        return (
            <div
                className={className}
                key={username}
                onClick={() => this.onSelectUser(i)}
            >
                <img className="inbox-info-img" src={profile_pic} alt="" />
                <div className="inbox-info-text">
                    <p className="inbox-info-name">{name}</p>
                    <p className="inbox-info-msg">{text}</p>
                </div>
            </div>
        );
    };

    renderUserInfo = user => {
        if (user === null) return null;

        var { name, username, profile_pic } = user;
        const { defaultProfileImage } = staticValues.images;
        if (profile_pic === null) profile_pic = defaultProfileImage;

        return (
            <div className="inbox-uinfo">
                <img src={profile_pic} alt="" className="inbox-uinfo-img" />
                <div className="inbox-uinfo-text">
                    <Link className="inbox-uinfo-name" to={`/user/${username}`}>
                        {name}
                    </Link>
                    <br></br>
                    <div className="inbox-uinfo-icon"></div>
                    <p className="inbox-uinfo-ls">Last seen 3 minutes ago</p>
                </div>
            </div>
        );
    };

    renderMessage = (data, user, i) => {
        var { text, from_user } = data;
        var className = "inbox-msg-div ";
        className +=
            from_user !== user.id ? "inbox-own-msg" : "inbox-other-msg";
        const { defaultProfileImage } = staticValues.images;
        var profile_pic = user.profile_pic
            ? user.profile_pic
            : defaultProfileImage;

        return (
            <div className={className} key={i}>
                <img src={profile_pic} alt="" className="inbox-msg-img" />
                <div className="inbox-msg-container">
                    <div className="inbox-msg-pointer"></div>
                    <p className="inbox-msg-text">{text}</p>
                </div>
                <img src="" alt="" onError={this.scrollToBottom}></img>
            </div>
        );
    };

    render() {
        var { inbox } = this.state.inbox;
        var { messages, user_info } = this.state.messages;

        return isAuthenticated() ? (
            <div className="inbox-container" key={this.state.key}>
                <div className="inbox-header-container">
                    <i
                        className="inbox-header-icon material-icons"
                        onClick={this.toggleInfo}
                    >
                        keyboard_arrow_left
                    </i>
                    <p className="inbox-header">Conversations</p>
                </div>
                <div className="inbox-inner">
                    <div
                        className="inbox-left"
                        style={{ height: this.getHeight() }}
                    >
                        {inbox.map((data, i) => this.renderInfo(data, i))}
                    </div>
                    <div
                        className="inbox-right"
                        style={{ height: this.getHeight() }}
                    >
                        {this.renderUserInfo(user_info)}
                        <div className="inbox-messages">
                            {messages.map((data, i) =>
                                this.renderMessage(data, user_info, i)
                            )}
                        </div>
                        {user_info ? (
                            <div className="inbox-inp-container">
                                <textarea
                                    type="text"
                                    className="inbox-inp"
                                    placeholder="Type here"
                                    disabled={this.state.loading}
                                    onKeyDown={this.onKeyDown}
                                />
                                <i
                                    className={
                                        "inbox-send-icon material-icons" +
                                        (this.state.loading
                                            ? " inbox-sending-icon"
                                            : "")
                                    }
                                    onClick={this.sendText}
                                >
                                    {this.state.loading
                                        ? "donut_large"
                                        : "send"}
                                </i>
                                <img
                                    src=""
                                    alt=""
                                    onError={this.scrollToBottom}
                                ></img>
                            </div>
                        ) : null}
                    </div>
                </div>
                <img src="" alt="" onError={this.addScrollbarStyle}></img>
            </div>
        ) : (
            <Redirect to="/" />
        );
    }
}

export default Inbox;
