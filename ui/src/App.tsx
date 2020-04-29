import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import MapSearch from './MapSearch';
import Download from './Download';
import Project from './Project';


export default () => {

    return <BrowserRouter>
        <Switch>
            <Route path="/projects/:id" component={ Project } />
            <Route path="/download" component={ Download } />
            <Route path="/" component={ MapSearch } />
        </Switch>
    </BrowserRouter>;
};
