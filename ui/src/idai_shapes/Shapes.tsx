import React, { ReactElement, useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { LoginContext } from '../App';
import { getPersistedLogin } from '../login';
import { doLogout } from '../logout';
import ShapesNav from '../shared/navbar/ShapesNav';
import BrowseSelect from './browseselect/BrowseSelect';
import { useRouteMatch } from 'react-router-dom';
import Home from './Home/Home';
import NotFound from '../shared/NotFound';

export default function Shapes(): ReactElement {
    
    const [loginData, setLoginData] = useState(getPersistedLogin());
    const match = useRouteMatch();


    useEffect(() => {

        document.title = 'iDAI.shapes';
    }, []);

    const baseUrl = match.path || '/';

    return (
        <BrowserRouter>
            <LoginContext.Provider value={ loginData }>
                <ShapesNav onLogout={ doLogout(setLoginData) } />
                <Switch>
                    <Route path= {baseUrl} exact component={ Home } />
                    <Redirect exact from={`${baseUrl}document`} to= {baseUrl} /> 
                    <Route path={ `${baseUrl}document/:documentId?` } component={ BrowseSelect } />
                    <Route component={ NotFound } />
                </Switch>
            </LoginContext.Provider>
        </BrowserRouter>
    );
}
