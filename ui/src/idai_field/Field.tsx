import React, { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import ImageView from '../shared/image/ImageView';
import { doLogout, getFallbackLogin, getLoginData, LoginContext } from '../shared/login';
import LoginForm from '../shared/loginform/LoginForm';
import Contact from './contact/Contact';
import DocumentRedirect from './DocumentRedirect';
import Download from './download/Download';
import Dashboard from './dashboard/Dashboard';
import Manual from './manual/Manual';
import FieldNav from './navbar/FieldNav';
import ProjectOverview from './overview/ProjectOverview';
import Project from './project/Project';
import ResourceRedirect from './ResourceRedirect';


export default function Field(): ReactElement {

    const [loginData, setLoginData] = useState(getFallbackLogin());

    useEffect(() => {

        document.title = 'iDAI.field';
        getLoginData().then(setLoginData);
    }, []);

    return (
        <BrowserRouter>
            <LoginContext.Provider value={ loginData }>
                <FieldNav onLogout={ doLogout(setLoginData) } />
                <Switch>
                    <Route path="/resource/:project/:identifier" component={ ResourceRedirect } />
                    <Redirect from="/resources/:project/:identifier" to="/resource/:project/:identifier" />

                    <Route path="/project/:projectId/:documentId?" component={ Project } />
                    <Redirect from="/projects/:id" to="/project/:id" />

                    <Route path="/document/:id" component={ DocumentRedirect } />
                    <Redirect from="/documents/:id" to="/document/:id" />

                    <Route path="/download" component={ Download } />

                    <Route path="/manual" component={ Manual } />

                    <Route path="/contact" component={ Contact } />

                    <Route path="/dashboard" component={ Dashboard } />

                    <Route path="/login">
                        <LoginForm onLogin={ setLoginData } />
                    </Route>

                    <Route path="/image/:project/:id" component={ ImageView } />

                    <Route path="/" component={ ProjectOverview } />
                </Switch>
            </LoginContext.Provider>
        </BrowserRouter>
    );
}
