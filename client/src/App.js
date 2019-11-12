import React, { Component } from "react";
import "./App.css";
import Main from './Components/Main'
import CreateApp from './Components/CreateApp';
//Import all needed Component for this tutorial
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
} from "react-router-dom";
import WithAuth from "./Components/WithAuth";
import Login from "./Components/Login";

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/create" component={WithAuth(CreateApp)}/>
                <Route exact path="/login" component={Login} />
                </Switch>
            </Router>
        );
    }
}

export default App;