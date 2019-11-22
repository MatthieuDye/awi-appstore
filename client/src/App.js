import React, { Component } from "react";
import "./App.css";
import Catalog from './Components/Catalog'

import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";
import WithAuth from "./Components/WithAuth";
import Login from "./Components/Login";
import Profile from "./Components/Profile";

/**
 * App: contains routes of the application, WithAuth protect the components by verifying token
 */
class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                <Route exact path="/" component={WithAuth(Catalog)} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profile" component={WithAuth(Profile)} />
                </Switch>
            </Router>
        );
    }
}

export default App;