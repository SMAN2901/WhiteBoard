import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Courses from "./components/courses/Courses";
import LoginForm from "./components/form/LoginForm";
import SignupForm from "./components/form/SignupForm";
import Profile from "./components/profile/Profile";
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
        const { user } = this.state;
        return (
            <React.Fragment>
                <Navbar user={user} />
                <Switch>
                    <Route path="/login" component={LoginForm} />
                    <Route path="/signup" component={SignupForm} />
                    <Route
                        path="/:username"
                        render={props => <Profile user={user} {...props} />}
                    />
                    <Route path="/" component={Courses} />
                </Switch>
            </React.Fragment>
        );
    }
}

export default App;
