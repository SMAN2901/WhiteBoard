import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Courses from "./components/courses/Courses";
import LoginForm from "./components/form/LoginForm";
import SignupForm from "./components/form/SignupForm";
import { getCurrentUser } from "./api/UsersApi";
import "./App.css";

class App extends Component {
    state = {};

    async componentDidMount() {
        const user = await getCurrentUser();
        this.setState({ user });
    }

    async componentDidUpdate() {
        //const user = await getCurrentUser();
        //this.setState({ user });
    }

    render() {
        return (
            <React.Fragment>
                <Navbar user={this.state.user} />
                <Switch>
                    <Route path="/login" component={LoginForm} />
                    <Route path="/signup" component={SignupForm} />
                    <Route path="/" component={Courses} />
                </Switch>
            </React.Fragment>
        );
    }
}

export default App;
