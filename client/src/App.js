import React, { Component } from "react";
import "./App.css";
import Main from './Components/Main'
import CreateOrEditApp from './Components/CreateOrEditApp';
//Import all needed Component for this tutorial
import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";
import WithAuth from "./Components/WithAuth";
import Login from "./Components/Login";
import Profile from "./Components/Profile";

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                <Route exact path="/" component={WithAuth(Main)} />
                <Route exact path="/create" component={WithAuth(CreateOrEditApp)}/>
                <Route exact path="/login" component={Login} />
                <Route exact path="/profile" component={WithAuth(Profile)} />
                </Switch>
            </Router>
        );
    }
}

export default App;