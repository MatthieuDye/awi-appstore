import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CreateOrEditApp from './Components/CreateOrEditApp';
import App from './Components/Main';
import Login from "./Components/Login";
import withAuth from "./Components/WithAuth";
import Profile from "./Components/Profile";
export default (
    <Route path='/' component={App}>
        <Route path='/addApp' component={withAuth(CreateOrEditApp)} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={withAuth(Profile)} />
    </Route>
);