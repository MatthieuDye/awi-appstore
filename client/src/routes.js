import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CreateApp from './components/CreateApp';
import App from './Components/Main';
export default (
    <Route path='/' component={App}>
        <Route path='addApp' component={CreateApp} />
    </Route>
);