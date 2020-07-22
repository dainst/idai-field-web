import React, { useState } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import ProjectOverview from './overview/ProjectOverview';
import Download from './download/Download';
import Document from './document/Document';
import Project from './project/Project';
import ResourceRedirect from './ResourceRedirect';
import Manual from './manual/Manual';
import Navbar from './Navbar';
import LoginForm from './LoginForm';


export interface LoginData {
    user: string;
    token: string;
}


const anonymousUser: LoginData = {
    user: 'anonymous',
    token: ''
};


export const LoginContext = React.createContext(anonymousUser);


export default () => {

    const [loginData, setLoginData] = useState(getPersistedLogin());

    return (
        <LoginContext.Provider value={ loginData }>
            <div>
                <BrowserRouter>
                    <Navbar onLogout={ doLogout(setLoginData) } />
                    <Switch>

                        <Route path="/resource/:project/:identifier" component={ ResourceRedirect } />
                        <Redirect from="/resources/:project/:identifier" to="/resource/:project/:identifier" />

                        <Route path="/document/:id" component={ Document } />
                        <Redirect from="/documents/:id" to="/document/:id" />

                        <Route path="/project/:projectId/:documentId?" component={ Project } />
                        <Redirect from="/projects/:id" to="/project/:id" />

                        <Route path="/download" component={ Download } />

                        <Route path="/manual" component={ Manual } />

                        <Route path="/login">
                            <LoginForm onLogin={ setLoginData } />
                        </Route>

                        <Route path="/" component={ ProjectOverview } />

                    </Switch>
                </BrowserRouter>
            </div>
        </LoginContext.Provider>
    );
};


const getPersistedLogin = (): LoginData => {

    const loginDataValue = localStorage.getItem('loginData');
    if (!loginDataValue) return anonymousUser;
    return JSON.parse(loginDataValue);
};

const doLogout = (setLoginData: (_: LoginData) => void) => () : void => {

    localStorage.removeItem('loginData');
    setLoginData(anonymousUser);
}
